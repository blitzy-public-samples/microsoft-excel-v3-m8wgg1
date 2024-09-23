import { CellValue, CellAddress, CellRange, ChartType, UserRole, WorkbookPermission, FontStyle, ColorHex, BorderStyle, Dimensions, PivotTableField, FilterCriteria, SortCriteria } from '../types';

export interface IUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    preferences: object;
}

export interface IWorkbook {
    id: string;
    name: string;
    worksheets: IWorksheet[];
    owner: IUser;
    createdAt: Date;
    modifiedAt: Date;
    permissions: WorkbookPermission[];
}

export interface IWorksheet {
    id: string;
    name: string;
    cells: ICell[][];
    rowCount: number;
    columnCount: number;
    charts: IChart[];
    pivotTables: IPivotTable[];
    filters: IFilter[];
    sorts: ISort[];
}

export interface ICell {
    address: CellAddress;
    value: CellValue;
    formula: IFormula | null;
    style: IStyle | null;
    dataValidation: IDataValidation | null;
    comment: IComment | null;
    hyperlink: IHyperlink | null;
}

export interface IFormula {
    expression: string;
    references: CellAddress[];
}

export interface IChart {
    id: string;
    type: ChartType;
    dataRange: CellRange;
    title: string;
    size: Dimensions;
    position: CellAddress;
}

export interface IStyle {
    font: FontStyle;
    backgroundColor: ColorHex;
    textColor: ColorHex;
    border: BorderStyle;
    numberFormat: string;
}

export interface IDataValidation {
    type: string;
    operator: string;
    value1: CellValue;
    value2?: CellValue;
    errorMessage: string;
}

export interface IConditionalFormat {
    range: CellRange;
    condition: string;
    style: IStyle;
}

export interface IPivotTable {
    id: string;
    sourceRange: CellRange;
    targetCell: CellAddress;
    rows: PivotTableField[];
    columns: PivotTableField[];
    values: PivotTableField[];
    filters: PivotTableField[];
}

export interface IFilter {
    columnIndex: number;
    criteria: FilterCriteria[];
}

export interface ISort {
    range: CellRange;
    criteria: SortCriteria[];
}

export interface IComment {
    author: string;
    content: string;
    timestamp: Date;
}

export interface IHyperlink {
    url: string;
    displayText: string;
}