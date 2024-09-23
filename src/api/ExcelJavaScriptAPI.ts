import { IWorkbook } from "../shared/interfaces/IWorkbook";
import { IWorksheet } from "../shared/interfaces/IWorksheet";
import { CellAddress } from "../shared/types/CellAddress";
import { CellValue } from "../shared/types/CellValue";
import { CellRange } from "../shared/types/CellRange";
import { ChartType } from "../shared/enums/ChartType";
import { WorkbookService } from "../core/services/WorkbookService";
import { CalculationService } from "../core/services/CalculationService";
import { VisualizationService } from "../core/services/VisualizationService";

export class ExcelJavaScriptAPI {
    private workbookService: WorkbookService;
    private calculationService: CalculationService;
    private visualizationService: VisualizationService;

    constructor(
        workbookService: WorkbookService,
        calculationService: CalculationService,
        visualizationService: VisualizationService
    ) {
        this.workbookService = workbookService;
        this.calculationService = calculationService;
        this.visualizationService = visualizationService;
    }

    async getActiveWorkbook(): Promise<IWorkbook> {
        try {
            return await this.workbookService.getActiveWorkbook();
        } catch (error) {
            console.error("Error getting active workbook:", error);
            throw error;
        }
    }

    async getWorksheets(): Promise<IWorksheet[]> {
        try {
            const workbook = await this.getActiveWorkbook();
            return workbook.getWorksheets();
        } catch (error) {
            console.error("Error getting worksheets:", error);
            throw error;
        }
    }

    async getActiveWorksheet(): Promise<IWorksheet> {
        try {
            const workbook = await this.getActiveWorkbook();
            return workbook.getActiveWorksheet();
        } catch (error) {
            console.error("Error getting active worksheet:", error);
            throw error;
        }
    }

    async getCellValue(cellAddress: CellAddress): Promise<CellValue> {
        try {
            const worksheet = await this.getActiveWorksheet();
            return worksheet.getCellValue(cellAddress);
        } catch (error) {
            console.error("Error getting cell value:", error);
            throw error;
        }
    }

    async setCellValue(cellAddress: CellAddress, value: CellValue): Promise<void> {
        try {
            const worksheet = await this.getActiveWorksheet();
            await worksheet.setCellValue(cellAddress, value);
            await this.calculationService.recalculateWorksheet(worksheet);
        } catch (error) {
            console.error("Error setting cell value:", error);
            throw error;
        }
    }

    async getRangeValues(range: CellRange): Promise<CellValue[][]> {
        try {
            const worksheet = await this.getActiveWorksheet();
            return worksheet.getRangeValues(range);
        } catch (error) {
            console.error("Error getting range values:", error);
            throw error;
        }
    }

    async setRangeValues(range: CellRange, values: CellValue[][]): Promise<void> {
        try {
            const worksheet = await this.getActiveWorksheet();
            await worksheet.setRangeValues(range, values);
            await this.calculationService.recalculateWorksheet(worksheet);
        } catch (error) {
            console.error("Error setting range values:", error);
            throw error;
        }
    }

    async createChart(type: ChartType, dataRange: CellRange): Promise<void> {
        try {
            const worksheet = await this.getActiveWorksheet();
            const chart = await this.visualizationService.createChart(type, dataRange);
            await worksheet.addChart(chart);
        } catch (error) {
            console.error("Error creating chart:", error);
            throw error;
        }
    }
}