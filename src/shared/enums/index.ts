/**
 * Represents the different types of charts available in Excel
 */
export enum ChartType {
    Column,
    Bar,
    Line,
    Pie,
    Scatter,
    Area,
    Radar,
    Combo
}

/**
 * Defines the roles a user can have in the Excel application
 */
export enum UserRole {
    Viewer,
    Editor,
    Contributor,
    Administrator
}

/**
 * Specifies the permissions a user can have on a workbook
 */
export enum WorkbookPermission {
    Read,
    Write,
    Share,
    Delete
}

/**
 * Represents the different data types a cell can contain
 */
export enum CellDataType {
    String,
    Number,
    Boolean,
    Date,
    Error,
    Empty
}

/**
 * Defines the different styles available for cell borders
 */
export enum BorderStyle {
    None,
    Thin,
    Medium,
    Thick,
    Double,
    Dotted,
    Dashed
}

/**
 * Specifies the direction for sorting operations
 */
export enum SortDirection {
    Ascending,
    Descending
}

/**
 * Defines the operators available for filtering data
 */
export enum FilterOperator {
    Equals,
    DoesNotEqual,
    GreaterThan,
    LessThan,
    GreaterThanOrEqual,
    LessThanOrEqual,
    BeginsWith,
    EndsWith,
    Contains,
    DoesNotContain
}

/**
 * Represents the types of data validation that can be applied to cells
 */
export enum DataValidationType {
    WholeNumber,
    Decimal,
    List,
    Date,
    Time,
    TextLength,
    Custom
}

/**
 * Specifies the operators used in data validation rules
 */
export enum DataValidationOperator {
    Between,
    NotBetween,
    EqualTo,
    NotEqualTo,
    GreaterThan,
    LessThan,
    GreaterThanOrEqualTo,
    LessThanOrEqualTo
}

/**
 * Defines the aggregation functions available for pivot tables
 */
export enum PivotTableFunction {
    Sum,
    Count,
    Average,
    Max,
    Min,
    Product,
    CountNumbers,
    StdDev,
    StdDevP,
    Var,
    VarP
}

/**
 * Represents the different types of errors that can occur in Excel formulas
 */
export enum ErrorType {
    Div0,
    NA,
    Name,
    Null,
    Num,
    Ref,
    Value
}

// Human tasks:
// TODO: Review and validate all enum values to ensure they cover all necessary options for each category
// TODO: Consider adding more specific chart types if needed (e.g., StackedColumn, Bubble)
// TODO: Evaluate the need for additional enums to support advanced Excel features
// TODO: Ensure that all enums are properly documented with JSDoc comments
// TODO: Consider adding a prefix to enum values if there's a risk of name collision (e.g., ChartType.ColumnChart)
// TODO: Assess if any enums need to be split into more granular categories
// TODO: Review the ErrorType enum and ensure it covers all possible Excel error types
// TODO: Consider adding enums for number formats, date formats, and other commonly used options in Excel