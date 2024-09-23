import { Client } from "@microsoft/microsoft-graph-client";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { IWorkbook } from "../shared/interfaces/IWorkbook";
import { IWorksheet } from "../shared/interfaces/IWorksheet";
import { CellAddress } from "../shared/types/CellAddress";
import { CellValue } from "../shared/types/CellValue";
import { CellRange } from "../shared/types/CellRange";
import { ChartType } from "../shared/enums/ChartType";

export class MicrosoftGraphAPI {
    private client: Client;

    constructor(accessToken: string) {
        this.client = Client.init({
            authProvider: (done) => {
                done(null, accessToken);
            }
        });
    }

    async getWorkbooks(): Promise<IWorkbook[]> {
        try {
            const response = await this.client
                .api("/me/drive/root/search(q='.xlsx')")
                .get();
            
            // TODO: Parse the response and convert to IWorkbook objects
            const workbooks: IWorkbook[] = []; // Placeholder for parsed workbooks
            return workbooks;
        } catch (error) {
            console.error("Error fetching workbooks:", error);
            throw error;
        }
    }

    async getWorkbook(workbookId: string): Promise<IWorkbook> {
        try {
            const response = await this.client
                .api(`/me/drive/items/${workbookId}/workbook`)
                .get();
            
            // TODO: Parse the response and convert to an IWorkbook object
            const workbook: IWorkbook = {} as IWorkbook; // Placeholder for parsed workbook
            return workbook;
        } catch (error) {
            console.error("Error fetching workbook:", error);
            throw error;
        }
    }

    async getWorksheets(workbookId: string): Promise<IWorksheet[]> {
        try {
            const response = await this.client
                .api(`/me/drive/items/${workbookId}/workbook/worksheets`)
                .get();
            
            // TODO: Parse the response and convert to IWorksheet objects
            const worksheets: IWorksheet[] = []; // Placeholder for parsed worksheets
            return worksheets;
        } catch (error) {
            console.error("Error fetching worksheets:", error);
            throw error;
        }
    }

    async getCellValue(workbookId: string, worksheetId: string, cellAddress: CellAddress): Promise<CellValue> {
        try {
            const response = await this.client
                .api(`/me/drive/items/${workbookId}/workbook/worksheets/${worksheetId}/range(address='${cellAddress}')`)
                .get();
            
            // TODO: Extract the cell value from the response
            const cellValue: CellValue = null; // Placeholder for extracted cell value
            return cellValue;
        } catch (error) {
            console.error("Error fetching cell value:", error);
            throw error;
        }
    }

    async setCellValue(workbookId: string, worksheetId: string, cellAddress: CellAddress, value: CellValue): Promise<void> {
        try {
            await this.client
                .api(`/me/drive/items/${workbookId}/workbook/worksheets/${worksheetId}/range(address='${cellAddress}')`)
                .patch({
                    values: [[value]]
                });
        } catch (error) {
            console.error("Error setting cell value:", error);
            throw error;
        }
    }

    async createChart(workbookId: string, worksheetId: string, type: ChartType, dataRange: CellRange): Promise<void> {
        try {
            await this.client
                .api(`/me/drive/items/${workbookId}/workbook/worksheets/${worksheetId}/charts/add`)
                .post({
                    type: type,
                    sourceData: dataRange,
                    seriesBy: "Auto"
                });
        } catch (error) {
            console.error("Error creating chart:", error);
            throw error;
        }
    }

    // TODO: Implement additional methods for pending tasks
    // - Batch operations
    // - Working with tables and pivot tables
    // - Advanced chart customization
    // - Workbook sharing and permissions
    // - Named ranges
    // - Inserting and deleting rows and columns
    // - Comments and notes
    // - Cell formatting
    // - Shapes and images
    // - Data validation rules
    // - Conditional formatting
    // - Token refresh mechanism
}