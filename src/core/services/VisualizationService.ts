import { IChart } from '../shared/interfaces';
import { ChartType } from '../shared/enums';
import { CellRange, Dimensions, CellAddress } from '../shared/types';
import { Chart } from '../models/Chart';
import { DataManagementService } from './DataManagementService';

export class VisualizationService {
    private dataManagementService: DataManagementService;

    constructor(dataManagementService: DataManagementService) {
        this.dataManagementService = dataManagementService;
    }

    async createChart(workbookId: string, worksheetId: string, type: ChartType, dataRange: CellRange, position: CellAddress): Promise<IChart> {
        // Create a new Chart instance
        const chart = new Chart(type, dataRange, position);

        // Fetch the data for the chart from the DataManagementService
        const chartData = await this.dataManagementService.getDataForRange(workbookId, worksheetId, dataRange);

        // Generate the chart visualization
        chart.generateVisualization(chartData);

        // Save the chart to the worksheet
        await this.dataManagementService.saveChart(workbookId, worksheetId, chart);

        // Return the new chart object
        return chart;
    }

    async updateChart(workbookId: string, worksheetId: string, chartId: string, updates: object): Promise<IChart> {
        // Retrieve the existing chart
        const chart = await this.dataManagementService.getChart(workbookId, worksheetId, chartId);

        // Apply the updates to the chart properties
        Object.assign(chart, updates);

        // Regenerate the chart visualization if necessary
        if (updates.hasOwnProperty('dataRange') || updates.hasOwnProperty('type')) {
            const chartData = await this.dataManagementService.getDataForRange(workbookId, worksheetId, chart.dataRange);
            chart.generateVisualization(chartData);
        }

        // Save the updated chart
        await this.dataManagementService.saveChart(workbookId, worksheetId, chart);

        // Return the updated chart object
        return chart;
    }

    async deleteChart(workbookId: string, worksheetId: string, chartId: string): Promise<boolean> {
        // Remove the chart from the worksheet
        const result = await this.dataManagementService.deleteChart(workbookId, worksheetId, chartId);

        // Delete any associated data or resources
        // (This step might involve cleaning up any cached data or temporary files)

        // Return the result of the operation
        return result;
    }

    async renderChart(chart: IChart): Promise<any> {
        // Fetch the latest data for the chart
        const chartData = await this.dataManagementService.getDataForRange(chart.workbookId, chart.worksheetId, chart.dataRange);

        // Apply any customizations or styles
        chart.applyCustomizations();

        // Generate the chart visualization
        const renderedChart = chart.generateVisualization(chartData);

        // Return the rendered chart data
        return renderedChart;
    }

    async exportChart(workbookId: string, worksheetId: string, chartId: string, format: string): Promise<Blob> {
        // Retrieve the chart
        const chart = await this.dataManagementService.getChart(workbookId, worksheetId, chartId);

        // Render the chart
        const renderedChart = await this.renderChart(chart);

        // Convert the rendered chart to the specified image format
        const imageBlob = await this.convertChartToImage(renderedChart, format);

        // Return the image data as a Blob
        return imageBlob;
    }

    async updateChartData(workbookId: string, worksheetId: string, chartId: string, newDataRange: CellRange): Promise<IChart> {
        // Retrieve the existing chart
        const chart = await this.dataManagementService.getChart(workbookId, worksheetId, chartId);

        // Update the chart's data range
        chart.dataRange = newDataRange;

        // Fetch the new data from the DataManagementService
        const newChartData = await this.dataManagementService.getDataForRange(workbookId, worksheetId, newDataRange);

        // Regenerate the chart visualization
        chart.generateVisualization(newChartData);

        // Save the updated chart
        await this.dataManagementService.saveChart(workbookId, worksheetId, chart);

        // Return the updated chart object
        return chart;
    }

    private async convertChartToImage(renderedChart: any, format: string): Promise<Blob> {
        // Implementation of chart to image conversion
        // This is a placeholder and should be implemented based on the actual rendering technology used
        throw new Error('Method not implemented.');
    }
}