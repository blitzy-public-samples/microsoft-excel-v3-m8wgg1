import { IWorkbook, IWorksheet, ICell } from '../shared/interfaces';
import { CellAddress, CellValue } from '../shared/types';
import { Workbook } from '../models/Workbook';
import { Worksheet } from '../models/Worksheet';
import { Cell } from '../models/Cell';

export class DataManagementService {
    private database: any;

    constructor(databaseConnection: any) {
        this.database = databaseConnection;
    }

    async saveWorkbook(workbook: IWorkbook): Promise<void> {
        const serializedWorkbook = this.serializeWorkbook(workbook);
        await this.database.workbooks.upsert(serializedWorkbook);
        await this.updateWorkbookMetadata(workbook.id);
    }

    async loadWorkbook(workbookId: string): Promise<IWorkbook> {
        const serializedWorkbook = await this.database.workbooks.findById(workbookId);
        if (!serializedWorkbook) {
            throw new Error(`Workbook with id ${workbookId} not found`);
        }
        return this.deserializeWorkbook(serializedWorkbook);
    }

    async deleteWorkbook(workbookId: string): Promise<boolean> {
        const result = await this.database.workbooks.delete(workbookId);
        await this.database.workbookMetadata.delete(workbookId);
        return result.deleted === 1;
    }

    async saveWorksheet(workbookId: string, worksheet: IWorksheet): Promise<void> {
        const serializedWorksheet = this.serializeWorksheet(worksheet);
        await this.database.worksheets.upsert({ workbookId, ...serializedWorksheet });
        await this.updateWorkbookMetadata(workbookId);
    }

    async loadWorksheet(workbookId: string, worksheetId: string): Promise<IWorksheet> {
        const serializedWorksheet = await this.database.worksheets.findOne({ workbookId, id: worksheetId });
        if (!serializedWorksheet) {
            throw new Error(`Worksheet with id ${worksheetId} not found in workbook ${workbookId}`);
        }
        return this.deserializeWorksheet(serializedWorksheet);
    }

    async updateCell(workbookId: string, worksheetId: string, cellAddress: CellAddress, value: CellValue): Promise<void> {
        await this.database.cells.upsert({ workbookId, worksheetId, cellAddress, value });
        await this.updateWorkbookMetadata(workbookId);
    }

    async bulkUpdateCells(workbookId: string, worksheetId: string, updates: Map<CellAddress, CellValue>): Promise<void> {
        const bulkOps = Array.from(updates).map(([cellAddress, value]) => ({
            updateOne: {
                filter: { workbookId, worksheetId, cellAddress },
                update: { $set: { value } },
                upsert: true
            }
        }));
        await this.database.cells.bulkWrite(bulkOps);
        await this.updateWorkbookMetadata(workbookId);
    }

    async getWorkbookMetadata(workbookId: string): Promise<object> {
        const metadata = await this.database.workbookMetadata.findById(workbookId);
        if (!metadata) {
            throw new Error(`Metadata for workbook ${workbookId} not found`);
        }
        return metadata;
    }

    async listWorkbooks(userId: string): Promise<IWorkbook[]> {
        const workbooks = await this.database.workbooks.find({ ownerId: userId });
        return workbooks.map(this.deserializeWorkbook);
    }

    private serializeWorkbook(workbook: IWorkbook): object {
        // Implement workbook serialization logic
        return JSON.parse(JSON.stringify(workbook));
    }

    private deserializeWorkbook(serializedWorkbook: object): IWorkbook {
        // Implement workbook deserialization logic
        return new Workbook(serializedWorkbook);
    }

    private serializeWorksheet(worksheet: IWorksheet): object {
        // Implement worksheet serialization logic
        return JSON.parse(JSON.stringify(worksheet));
    }

    private deserializeWorksheet(serializedWorksheet: object): IWorksheet {
        // Implement worksheet deserialization logic
        return new Worksheet(serializedWorksheet);
    }

    private async updateWorkbookMetadata(workbookId: string): Promise<void> {
        // Implement metadata update logic
        const lastModified = new Date();
        await this.database.workbookMetadata.updateOne(
            { _id: workbookId },
            { $set: { lastModified } },
            { upsert: true }
        );
    }
}