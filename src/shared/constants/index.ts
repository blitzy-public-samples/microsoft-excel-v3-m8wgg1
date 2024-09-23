import { FontStyle, ChartType, UserRole, WorkbookPermission, DateTimeFormat, CurrencyFormat, NumberFormat } from './types';

export const MAX_ROWS: number = 1048576;
export const MAX_COLUMNS: number = 16384;

export const DEFAULT_FONT: FontStyle = { name: 'Calibri', size: 11, bold: false, italic: false, underline: false };

export const DEFAULT_CELL_WIDTH: number = 64;
export const DEFAULT_CELL_HEIGHT: number = 20;
export const DEFAULT_DECIMAL_PLACES: number = 2;

export const CHART_TYPES: ChartType[] = ['Column', 'Bar', 'Line', 'Pie', 'Scatter', 'Area', 'Radar', 'Combo'];

export const USER_ROLES: UserRole[] = ['Viewer', 'Editor', 'Contributor', 'Administrator'];

export const WORKBOOK_PERMISSIONS: WorkbookPermission[] = ['Read', 'Write', 'Share', 'Delete'];

export const DATE_FORMATS: DateTimeFormat[] = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY HH:mm', 'DD/MM/YYYY HH:mm', 'YYYY-MM-DD HH:mm'];

export const CURRENCY_FORMATS: CurrencyFormat[] = ['$#,##0.00', '€#,##0.00', '£#,##0.00', '¥#,##0'];

export const NUMBER_FORMATS: NumberFormat[] = ['General', '#,##0', '#,##0.00', '0%', '0.00%'];

export const BORDER_STYLES: string[] = ['None', 'Thin', 'Medium', 'Thick', 'Double', 'Dotted', 'Dashed'];

export const CONDITIONAL_FORMAT_OPERATORS: string[] = ['>', '<', '>=', '<=', '=', '<>', 'Between', 'Not Between'];

export const FILTER_OPERATORS: string[] = ['Equals', 'Does Not Equal', 'Greater Than', 'Less Than', 'Begins With', 'Ends With', 'Contains'];

export const SORT_DIRECTIONS: string[] = ['ascending', 'descending'];

export const PIVOT_TABLE_FUNCTIONS: string[] = ['Sum', 'Average', 'Count', 'Min', 'Max'];

export const DATA_VALIDATION_TYPES: string[] = ['Whole Number', 'Decimal', 'List', 'Date', 'Time', 'Text Length'];

export const DATA_VALIDATION_OPERATORS: string[] = ['Between', 'Not Between', 'Equal To', 'Not Equal To', 'Greater Than', 'Less Than', 'Greater Than or Equal To', 'Less Than or Equal To'];

export const DEFAULT_WORKBOOK_NAME: string = 'Workbook';
export const DEFAULT_WORKSHEET_NAME: string = 'Sheet';
export const MAX_WORKSHEET_NAME_LENGTH: number = 31;

export const MAX_WORKBOOK_SIZE: number = 104857600; // 100 MB in bytes

export const AUTO_SAVE_INTERVAL: number = 300000; // 5 minutes in milliseconds

export const MAX_UNDO_STACK_SIZE: number = 100;

export const MAX_FORMULA_LENGTH: number = 8192;
export const MAX_CELL_CONTENT_LENGTH: number = 32767;