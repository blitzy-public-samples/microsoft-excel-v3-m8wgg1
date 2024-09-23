import { IWorksheet, ICell, IChart, IPivotTable, IFilter, ISort } from '../shared/interfaces';
import { generateUniqueId } from '../shared/utils';
import { Cell } from './Cell';
import { Chart } from './Chart';
import { PivotTable } from './PivotTable';
import { Filter } from './Filter';
import { Sort } from './Sort';
import { ChartType, CellRange, CellAddress, FilterCriteria, SortCriteria } from '../shared/types';

export class Worksheet implements IWorksheet {
    public id: string;
    public name: string;
    public cells: Cell[][];
    public rowCount: number;
    public columnCount: number;
    public charts: Chart[];
    public pivotTables: PivotTable[];
    public filters: Filter[];
    public sorts: Sort[];

    constructor(name: string, rowCount: number, columnCount: number) {
        this.id = generateUniqueId();
        this.name = name;
        this.rowCount = rowCount;
        this.columnCount = columnCount;
        this.cells = this.initializeCells(rowCount, columnCount);
        this.charts = [];
        this.pivotTables = [];
        this.filters = [];
        this.sorts = [];
    }

    private initializeCells(rowCount: number, columnCount: number): Cell[][] {
        const cells: Cell[][] = [];
        for (let i = 0; i < rowCount; i++) {
            cells[i] = [];
            for (let j = 0; j < columnCount; j++) {
                cells[i][j] = new Cell({ row: i, column: j }, null);
            }
        }
        return cells;
    }

    public getCell(row: number, column: number): Cell {
        if (row < 0 || row >= this.rowCount || column < 0 || column >= this.columnCount) {
            throw new Error('Invalid cell coordinates');
        }
        return this.cells[row][column];
    }

    public setCellValue(row: number, column: number, value: any): void {
        const cell = this.getCell(row, column);
        cell.setValue(value);
        // TODO: Trigger recalculations or updates
    }

    public addChart(type: ChartType, dataRange: CellRange): Chart {
        const chart = new Chart(type, dataRange, { row: 0, column: this.columnCount + 1 });
        this.charts.push(chart);
        return chart;
    }

    public addPivotTable(sourceRange: CellRange, targetCell: CellAddress): PivotTable {
        const pivotTable = new PivotTable(sourceRange, targetCell);
        this.pivotTables.push(pivotTable);
        return pivotTable;
    }

    public applyFilter(columnIndex: number, criteria: FilterCriteria[]): Filter {
        const filter = new Filter(columnIndex, criteria);
        this.filters.push(filter);
        // TODO: Apply the filter to the worksheet data
        return filter;
    }

    public applySort(range: CellRange, criteria: SortCriteria[]): Sort {
        const sort = new Sort(range, criteria);
        this.sorts.push(sort);
        // TODO: Apply the sort to the worksheet data
        return sort;
    }

    public insertRow(rowIndex: number): void {
        if (rowIndex < 0 || rowIndex > this.rowCount) {
            throw new Error('Invalid row index');
        }
        this.cells.splice(rowIndex, 0, new Array(this.columnCount).fill(null).map((_, colIndex) => new Cell({ row: rowIndex, column: colIndex }, null)));
        this.rowCount++;
        // TODO: Adjust affected charts, pivot tables, filters, and sorts
    }

    public insertColumn(columnIndex: number): void {
        if (columnIndex < 0 || columnIndex > this.columnCount) {
            throw new Error('Invalid column index');
        }
        this.cells.forEach((row, rowIndex) => {
            row.splice(columnIndex, 0, new Cell({ row: rowIndex, column: columnIndex }, null));
        });
        this.columnCount++;
        // TODO: Adjust affected charts, pivot tables, filters, and sorts
    }

    public deleteRow(rowIndex: number): void {
        if (rowIndex < 0 || rowIndex >= this.rowCount) {
            throw new Error('Invalid row index');
        }
        this.cells.splice(rowIndex, 1);
        this.rowCount--;
        // TODO: Adjust affected charts, pivot tables, filters, and sorts
    }

    public deleteColumn(columnIndex: number): void {
        if (columnIndex < 0 || columnIndex >= this.columnCount) {
            throw new Error('Invalid column index');
        }
        this.cells.forEach(row => row.splice(columnIndex, 1));
        this.columnCount--;
        // TODO: Adjust affected charts, pivot tables, filters, and sorts
    }

    public toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            rowCount: this.rowCount,
            columnCount: this.columnCount,
            cells: this.cells.map(row => row.map(cell => cell.toJSON())),
            charts: this.charts.map(chart => chart.toJSON()),
            pivotTables: this.pivotTables.map(pivotTable => pivotTable.toJSON()),
            filters: this.filters.map(filter => filter.toJSON()),
            sorts: this.sorts.map(sort => sort.toJSON())
        };
    }
}