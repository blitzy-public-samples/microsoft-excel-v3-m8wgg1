import { IWorkbook, IUser } from '../shared/interfaces';
import { Workbook } from '../models/Workbook';
import { WorkbookPermission } from '../shared/enums';
import { AuthService } from './AuthService';
import { CalculationService } from './CalculationService';
import { DataManagementService } from './DataManagementService';

export class WorkbookService {
    private workbooks: Map<string, IWorkbook>;
    private authService: AuthService;
    private calculationService: CalculationService;
    private dataManagementService: DataManagementService;

    constructor(
        authService: AuthService,
        calculationService: CalculationService,
        dataManagementService: DataManagementService
    ) {
        this.workbooks = new Map<string, IWorkbook>();
        this.authService = authService;
        this.calculationService = calculationService;
        this.dataManagementService = dataManagementService;
    }

    async createWorkbook(name: string, sessionToken: string): Promise<IWorkbook> {
        // Authenticate the user
        const user = await this.authService.getCurrentUser(sessionToken);
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Create a new Workbook instance
        const workbook = new Workbook(name, user);

        // Store the workbook in the workbooks Map
        this.workbooks.set(workbook.id, workbook);

        // TODO: Implement persistence using DataManagementService

        return workbook;
    }

    async getWorkbook(workbookId: string, sessionToken: string): Promise<IWorkbook | null> {
        // Authenticate the user
        const user = await this.authService.getCurrentUser(sessionToken);
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Retrieve the workbook
        const workbook = this.workbooks.get(workbookId);

        if (!workbook) {
            return null;
        }

        // Check if the user has permission to access the workbook
        if (!workbook.hasPermission(user, WorkbookPermission.Read)) {
            throw new Error('User does not have permission to access this workbook');
        }

        return workbook;
    }

    async saveWorkbook(workbookId: string, sessionToken: string): Promise<void> {
        // Authenticate the user
        const user = await this.authService.getCurrentUser(sessionToken);
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Retrieve the workbook
        const workbook = this.workbooks.get(workbookId);
        if (!workbook) {
            throw new Error('Workbook not found');
        }

        // Check if the user has permission to modify the workbook
        if (!workbook.hasPermission(user, WorkbookPermission.Write)) {
            throw new Error('User does not have permission to modify this workbook');
        }

        // Trigger recalculations
        await this.calculationService.recalculateWorkbook(workbook);

        // Save the workbook data
        await this.dataManagementService.saveWorkbook(workbook);
    }

    async deleteWorkbook(workbookId: string, sessionToken: string): Promise<boolean> {
        // Authenticate the user
        const user = await this.authService.getCurrentUser(sessionToken);
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Retrieve the workbook
        const workbook = this.workbooks.get(workbookId);
        if (!workbook) {
            return false;
        }

        // Check if the user has permission to delete the workbook
        if (!workbook.hasPermission(user, WorkbookPermission.Delete)) {
            throw new Error('User does not have permission to delete this workbook');
        }

        // Remove the workbook from the workbooks Map
        this.workbooks.delete(workbookId);

        // Delete the workbook data
        await this.dataManagementService.deleteWorkbook(workbookId);

        return true;
    }

    async shareWorkbook(workbookId: string, targetUserEmail: string, permission: WorkbookPermission, sessionToken: string): Promise<void> {
        // Authenticate the user
        const user = await this.authService.getCurrentUser(sessionToken);
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Retrieve the workbook
        const workbook = this.workbooks.get(workbookId);
        if (!workbook) {
            throw new Error('Workbook not found');
        }

        // Check if the user has permission to share the workbook
        if (!workbook.hasPermission(user, WorkbookPermission.Share)) {
            throw new Error('User does not have permission to share this workbook');
        }

        // Find the target user by email
        const targetUser = await this.authService.getUserByEmail(targetUserEmail);
        if (!targetUser) {
            throw new Error('Target user not found');
        }

        // Update the workbook's permissions for the target user
        workbook.setPermissions(targetUser, permission);

        // Save the updated workbook
        await this.saveWorkbook(workbookId, sessionToken);
    }

    async listWorkbooks(sessionToken: string): Promise<IWorkbook[]> {
        // Authenticate the user
        const user = await this.authService.getCurrentUser(sessionToken);
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Filter the workbooks Map to include only those accessible to the user
        const accessibleWorkbooks = Array.from(this.workbooks.values()).filter(workbook => 
            workbook.hasPermission(user, WorkbookPermission.Read)
        );

        return accessibleWorkbooks;
    }
}