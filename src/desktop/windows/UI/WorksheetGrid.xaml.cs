using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Collections.Generic;
using WorkbookService = ExcelApp.Core.Services.WorkbookService;
using CalculationService = ExcelApp.Core.Services.CalculationService;
using IWorksheet = ExcelApp.Shared.Interfaces.IWorksheet;
using CellAddress = ExcelApp.Shared.Types.CellAddress;
using CellValue = ExcelApp.Shared.Types.CellValue;

namespace ExcelApp.Desktop.Windows.UI
{
    public partial class WorksheetGrid : UserControl
    {
        private WorkbookService workbookService;
        private CalculationService calculationService;
        private IWorksheet currentWorksheet;
        private int rowCount = 1000;
        private int columnCount = 26;
        private double cellWidth = 100;
        private double cellHeight = 25;
        private Dictionary<CellAddress, TextBox> cellControls;

        public WorksheetGrid(WorkbookService workbookService, CalculationService calculationService)
        {
            InitializeComponent();
            this.workbookService = workbookService;
            this.calculationService = calculationService;
            cellControls = new Dictionary<CellAddress, TextBox>();
            InitializeGrid();
        }

        private void InitializeGrid()
        {
            CellsCanvas.Children.Clear();
            cellControls.Clear();

            // Create column headers
            for (int col = 0; col < columnCount; col++)
            {
                TextBlock header = new TextBlock
                {
                    Text = GetColumnName(col),
                    Width = cellWidth,
                    TextAlignment = TextAlignment.Center
                };
                Canvas.SetLeft(header, col * cellWidth);
                Canvas.SetTop(header, 0);
                ColumnHeadersCanvas.Children.Add(header);
            }

            // Create row headers
            for (int row = 0; row < rowCount; row++)
            {
                TextBlock header = new TextBlock
                {
                    Text = (row + 1).ToString(),
                    Height = cellHeight,
                    TextAlignment = TextAlignment.Right,
                    VerticalAlignment = VerticalAlignment.Center
                };
                Canvas.SetLeft(header, 0);
                Canvas.SetTop(header, (row + 1) * cellHeight);
                RowHeadersCanvas.Children.Add(header);
            }

            // Create cells
            for (int row = 0; row < rowCount; row++)
            {
                for (int col = 0; col < columnCount; col++)
                {
                    CreateCell(row, col);
                }
            }
        }

        private TextBox CreateCell(int row, int col)
        {
            TextBox cell = new TextBox
            {
                Width = cellWidth,
                Height = cellHeight,
                BorderThickness = new Thickness(1),
                BorderBrush = Brushes.LightGray
            };

            Canvas.SetLeft(cell, col * cellWidth);
            Canvas.SetTop(cell, (row + 1) * cellHeight);
            CellsCanvas.Children.Add(cell);

            CellAddress address = new CellAddress { Row = row, Column = col };
            cellControls[address] = cell;

            cell.TextChanged += OnCellValueChanged;
            cell.GotFocus += OnCellGotFocus;

            return cell;
        }

        private void UpdateCellValue(CellAddress cellAddress, CellValue newValue)
        {
            currentWorksheet.SetCellValue(cellAddress, newValue);
            if (cellControls.TryGetValue(cellAddress, out TextBox cellControl))
            {
                cellControl.Text = newValue.ToString();
            }
            calculationService.RecalculateDependentCells(currentWorksheet, cellAddress);
        }

        private void OnCellValueChanged(object sender, TextChangedEventArgs e)
        {
            if (sender is TextBox cellControl)
            {
                CellAddress address = cellControls.FirstOrDefault(x => x.Value == cellControl).Key;
                if (address != null)
                {
                    CellValue newValue = new CellValue(cellControl.Text);
                    UpdateCellValue(address, newValue);
                }
            }
        }

        private void OnCellGotFocus(object sender, RoutedEventArgs e)
        {
            if (sender is TextBox cellControl)
            {
                CellAddress address = cellControls.FirstOrDefault(x => x.Value == cellControl).Key;
                if (address != null)
                {
                    // Highlight the focused cell
                    cellControl.BorderBrush = Brushes.Blue;
                    cellControl.BorderThickness = new Thickness(2);

                    // Update formula bar (assuming there's a FormulaBar control)
                    // FormulaBar.SetFormula(currentWorksheet.GetCellFormula(address));
                }
            }
        }

        public void RefreshGrid()
        {
            foreach (var kvp in cellControls)
            {
                CellValue value = currentWorksheet.GetCellValue(kvp.Key);
                kvp.Value.Text = value.ToString();
                // Apply formatting based on cell properties
            }
        }

        private string GetColumnName(int index)
        {
            const string letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            string result = "";

            while (index >= 0)
            {
                result = letters[index % 26] + result;
                index = index / 26 - 1;
            }

            return result;
        }
    }
}