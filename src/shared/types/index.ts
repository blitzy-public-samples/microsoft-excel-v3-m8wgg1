// CellValue represents the possible values a cell can contain
export type CellValue = string | number | boolean | null;

// CellAddress represents the position of a cell in a worksheet
export type CellAddress = {
  row: number;
  column: number;
};

// CellRange represents a range of cells in a worksheet
export type CellRange = {
  start: CellAddress;
  end: CellAddress;
};

// FormulaType represents a formula as a string
export type FormulaType = string;

// ChartType represents the type of chart as a string
export type ChartType = string;

// UserRole represents the role of a user as a string
export type UserRole = string;

// WorkbookPermission represents the permission level for a workbook as a string
export type WorkbookPermission = string;

// ColorHex represents a color in hexadecimal format
export type ColorHex = string;

// Dimensions represents the width and height of an object
export type Dimensions = {
  width: number;
  height: number;
};

// DateTimeFormat represents the format for date and time as a string
export type DateTimeFormat = string;

// CurrencyFormat represents the format for currency as a string
export type CurrencyFormat = string;

// NumberFormat represents the format for numbers as a string
export type NumberFormat = string;

// FontStyle represents the style properties of a font
export type FontStyle = {
  name: string;
  size: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

// BorderStyle represents the style properties of a cell border
export type BorderStyle = {
  style: string;
  color: ColorHex;
};

// CellStyle represents the style properties of a cell
export type CellStyle = {
  fontStyle: FontStyle;
  backgroundColor: ColorHex;
  textColor: ColorHex;
  borderStyle: BorderStyle;
};

// ConditionalFormatRule represents a rule for conditional formatting
export type ConditionalFormatRule = {
  condition: string;
  style: CellStyle;
};

// FilterCriteria represents the criteria for filtering data
export type FilterCriteria = {
  column: number;
  condition: string;
  value: CellValue;
};

// SortCriteria represents the criteria for sorting data
export type SortCriteria = {
  column: number;
  direction: 'ascending' | 'descending';
};

// PivotTableField represents a field in a pivot table
export type PivotTableField = {
  name: string;
  function: string;
};

// DataValidationRule represents a rule for data validation
export type DataValidationRule = {
  type: string;
  operator: string;
  value1: CellValue;
  value2?: CellValue;
};

// HyperlinkType represents a hyperlink in a cell
export type HyperlinkType = {
  url: string;
  displayText: string;
};

// CommentType represents a comment on a cell
export type CommentType = {
  author: string;
  content: string;
  timestamp: Date;
};