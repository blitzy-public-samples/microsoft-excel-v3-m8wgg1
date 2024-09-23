Option Explicit

' ExcelVbaAPI Module
' This module provides a set of functions and subroutines for interacting with Excel objects and data from within VBA macros.

Public Function GetActiveWorkbook() As Workbook
    ' Gets a reference to the currently active workbook
    ' Returns: The active workbook object
    Set GetActiveWorkbook = Application.ActiveWorkbook
End Function

Public Function GetActiveWorksheet() As Worksheet
    ' Gets a reference to the currently active worksheet
    ' Returns: The active worksheet object
    Set GetActiveWorksheet = Application.ActiveSheet
End Function

Public Function GetCellValue(cellAddress As String) As Variant
    ' Gets the value of a specific cell
    ' Parameters:
    '   cellAddress: String - The address of the cell (e.g., "A1")
    ' Returns: The cell value
    Dim ws As Worksheet
    Set ws = GetActiveWorksheet()
    GetCellValue = ws.Range(cellAddress).Value
End Function

Public Sub SetCellValue(cellAddress As String, value As Variant)
    ' Sets the value of a specific cell
    ' Parameters:
    '   cellAddress: String - The address of the cell (e.g., "A1")
    '   value: Variant - The value to set in the cell
    Dim ws As Worksheet
    Set ws = GetActiveWorksheet()
    ws.Range(cellAddress).Value = value
End Sub

Public Function GetRangeValues(rangeAddress As String) As Variant
    ' Gets the values of a range of cells
    ' Parameters:
    '   rangeAddress: String - The address of the range (e.g., "A1:B10")
    ' Returns: 2D array of cell values
    Dim ws As Worksheet
    Set ws = GetActiveWorksheet()
    GetRangeValues = ws.Range(rangeAddress).Value
End Function

Public Sub SetRangeValues(rangeAddress As String, values As Variant)
    ' Sets the values of a range of cells
    ' Parameters:
    '   rangeAddress: String - The address of the range (e.g., "A1:B10")
    '   values: Variant(,) - 2D array of values to set in the range
    Dim ws As Worksheet
    Set ws = GetActiveWorksheet()
    ws.Range(rangeAddress).Value = values
End Sub

Public Function CreateChart(chartType As XlChartType, dataRange As String) As Chart
    ' Creates a new chart in the active worksheet
    ' Parameters:
    '   chartType: XlChartType - The type of chart to create
    '   dataRange: String - The address of the data range for the chart
    ' Returns: The newly created chart object
    Dim ws As Worksheet
    Dim cht As Chart
    
    Set ws = GetActiveWorksheet()
    Set cht = ws.Shapes.AddChart2(, chartType).Chart
    cht.SetSourceData Source:=ws.Range(dataRange)
    
    Set CreateChart = cht
End Function

Public Function RunMacro(macroName As String) As Variant
    ' Runs a specified VBA macro
    ' Parameters:
    '   macroName: String - The name of the macro to run
    ' Returns: The result of the macro execution, if any
    On Error Resume Next
    RunMacro = Application.Run(macroName)
    On Error GoTo 0
End Function