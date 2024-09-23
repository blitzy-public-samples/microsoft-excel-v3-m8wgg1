import { IWorkbook, IUser } from '../shared/interfaces';
import { CellAddress, CellValue } from '../shared/types';
import { AuthService } from './AuthService';
import { WorkbookService } from './WorkbookService';
import { DataManagementService } from './DataManagementService';
import * as SignalR from '@microsoft/signalr';

export class CollaborationService {
    private activeUsers: Map<string, Set<string>> = new Map();
    private realtimeConnection: SignalR.HubConnection;

    constructor(
        private authService: AuthService,
        private workbookService: WorkbookService,
        private dataManagementService: DataManagementService
    ) {
        this.setupRealtimeConnection();
    }

    private setupRealtimeConnection() {
        this.realtimeConnection = new SignalR.HubConnectionBuilder()
            .withUrl("/collaborationHub")
            .withAutomaticReconnect()
            .build();

        this.realtimeConnection.start().catch(err => console.error("SignalR Connection Error: ", err));
    }

    async joinWorkbook(workbookId: string, userId: string): Promise<void> {
        const hasPermission = await this.workbookService.checkUserPermission(workbookId, userId);
        if (!hasPermission) {
            throw new Error("User does not have permission to access this workbook");
        }

        if (!this.activeUsers.has(workbookId)) {
            this.activeUsers.set(workbookId, new Set());
        }
        this.activeUsers.get(workbookId)!.add(userId);

        await this.realtimeConnection.invoke("JoinWorkbook", workbookId, userId);

        const workbookState = await this.syncWorkbook(workbookId, userId);
        await this.realtimeConnection.invoke("SendWorkbookState", workbookId, userId, workbookState);
    }

    async leaveWorkbook(workbookId: string, userId: string): Promise<void> {
        if (this.activeUsers.has(workbookId)) {
            this.activeUsers.get(workbookId)!.delete(userId);
            if (this.activeUsers.get(workbookId)!.size === 0) {
                this.activeUsers.delete(workbookId);
            }
        }

        await this.realtimeConnection.invoke("LeaveWorkbook", workbookId, userId);
        // Clean up any user-specific resources or locks
        await this.dataManagementService.releaseUserLocks(workbookId, userId);
    }

    async broadcastChange(
        workbookId: string,
        worksheetId: string,
        cellAddress: CellAddress,
        newValue: CellValue,
        userId: string
    ): Promise<void> {
        const hasPermission = await this.workbookService.checkUserPermission(workbookId, userId);
        if (!hasPermission) {
            throw new Error("User does not have permission to edit this workbook");
        }

        await this.dataManagementService.updateCell(workbookId, worksheetId, cellAddress, newValue);
        await this.realtimeConnection.invoke("BroadcastChange", workbookId, worksheetId, cellAddress, newValue, userId);
        await this.dataManagementService.addToChangeHistory(workbookId, worksheetId, cellAddress, newValue, userId);
    }

    async syncWorkbook(workbookId: string, userId: string): Promise<IWorkbook> {
        const workbookState = await this.dataManagementService.getWorkbookState(workbookId);
        const pendingChanges = await this.dataManagementService.getPendingChanges(workbookId);
        
        // Apply pending changes to the workbook state
        for (const change of pendingChanges) {
            // Apply change logic here
        }

        return workbookState;
    }

    async getActiveUsers(workbookId: string): Promise<IUser[]> {
        const activeUserIds = this.activeUsers.get(workbookId) || new Set();
        const activeUsers: IUser[] = [];

        for (const userId of activeUserIds) {
            const user = await this.authService.getUserById(userId);
            if (user) {
                activeUsers.push(user);
            }
        }

        return activeUsers;
    }

    async lockCell(workbookId: string, worksheetId: string, cellAddress: CellAddress, userId: string): Promise<boolean> {
        const isLocked = await this.dataManagementService.isCellLocked(workbookId, worksheetId, cellAddress);
        if (isLocked) {
            return false;
        }

        await this.dataManagementService.lockCell(workbookId, worksheetId, cellAddress, userId);
        await this.realtimeConnection.invoke("NotifyCellLocked", workbookId, worksheetId, cellAddress, userId);
        return true;
    }

    async unlockCell(workbookId: string, worksheetId: string, cellAddress: CellAddress, userId: string): Promise<void> {
        const lockOwner = await this.dataManagementService.getCellLockOwner(workbookId, worksheetId, cellAddress);
        if (lockOwner !== userId) {
            throw new Error("User does not own the lock on this cell");
        }

        await this.dataManagementService.unlockCell(workbookId, worksheetId, cellAddress);
        await this.realtimeConnection.invoke("NotifyCellUnlocked", workbookId, worksheetId, cellAddress);
    }
}