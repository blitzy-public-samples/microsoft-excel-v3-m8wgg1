import { IWorkbook, IWorksheet, IUser } from '../shared/interfaces';
import { WorkbookPermission } from '../shared/enums';
import { generateUniqueId } from '../shared/utils';
import { Worksheet } from './Worksheet';

export class Workbook implements IWorkbook {
    id: string;
    name: string;
    worksheets: Worksheet[];
    owner: IUser;
    createdAt: Date;
    modifiedAt: Date;
    permissions: WorkbookPermission[];

    constructor(name: string, owner: IUser) {
        this.id = generateUniqueId();
        this.name = name;
        this.owner = owner;
        this.worksheets = [new Worksheet('Sheet1')];
        this.createdAt = new Date();
        this.modifiedAt = new Date();
        this.permissions = [WorkbookPermission.Read, WorkbookPermission.Write, WorkbookPermission.Share, WorkbookPermission.Delete];
    }

    addWorksheet(name: string): Worksheet {
        // TODO: Implement validation for worksheet name
        const newWorksheet = new Worksheet(name);
        this.worksheets.push(newWorksheet);
        this.modifiedAt = new Date();
        return newWorksheet;
    }

    removeWorksheet(worksheetId: string): boolean {
        const index = this.worksheets.findIndex(ws => ws.id === worksheetId);
        if (index !== -1) {
            this.worksheets.splice(index, 1);
            this.modifiedAt = new Date();
            return true;
        }
        return false;
    }

    getWorksheet(idOrName: string): Worksheet | undefined {
        return this.worksheets.find(ws => ws.id === idOrName || ws.name === idOrName);
    }

    setPermissions(user: IUser, permissions: WorkbookPermission[]): void {
        // TODO: Implement validation for user and permissions
        // This is a simplified implementation. In a real-world scenario, you'd likely have a more complex permission system.
        this.permissions = permissions;
        this.modifiedAt = new Date();
    }

    hasPermission(user: IUser, permission: WorkbookPermission): boolean {
        // This is a simplified check. In a real implementation, you'd check against the specific user's permissions.
        return this.permissions.includes(permission);
    }

    async save(): Promise<void> {
        this.modifiedAt = new Date();
        // TODO: Implement actual saving logic (e.g., to a database or file system)
        console.log('Saving workbook:', this.toJSON());
        // Simulating an asynchronous operation
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            worksheets: this.worksheets.map(ws => ws.toJSON()),
            owner: this.owner,
            createdAt: this.createdAt,
            modifiedAt: this.modifiedAt,
            permissions: this.permissions
        };
    }
}