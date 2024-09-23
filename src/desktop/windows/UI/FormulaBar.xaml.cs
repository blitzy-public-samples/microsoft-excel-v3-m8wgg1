using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using WorkbookService = ExcelApp.Core.Services.WorkbookService;
using CalculationService = ExcelApp.Core.Services.CalculationService;
using IWorksheet = ExcelApp.Shared.Interfaces.IWorksheet;
using CellAddress = ExcelApp.Shared.Types.CellAddress;
using CellValue = ExcelApp.Shared.Types.CellValue;

namespace ExcelApp.Desktop.Windows.UI
{
    public partial class FormulaBar : UserControl
    {
        private readonly WorkbookService workbookService;
        private readonly CalculationService calculationService;
        private IWorksheet currentWorksheet;
        private CellAddress currentCellAddress;

        public FormulaBar(WorkbookService workbookService, CalculationService calculationService)
        {
            InitializeComponent();
            this.workbookService = workbookService;
            this.calculationService = calculationService;

            // Add event handlers for FormulaTextBox
            FormulaTextBox.TextChanged += OnFormulaTextChanged;
            FormulaTextBox.KeyDown += OnFormulaKeyDown;
        }

        public void UpdateFormulaBar(CellAddress cellAddress)
        {
            currentCellAddress = cellAddress;
            if (currentWorksheet != null)
            {
                var cellContent = currentWorksheet.GetCellValue(cellAddress);
                FormulaTextBox.Text = cellContent.ToString();
                FormulaTextBox.CaretIndex = FormulaTextBox.Text.Length;
            }
        }

        private void OnFormulaTextChanged(object sender, TextChangedEventArgs e)
        {
            if (currentWorksheet != null && currentCellAddress != null)
            {
                string newText = FormulaTextBox.Text;
                currentWorksheet.SetCellValue(currentCellAddress, new CellValue(newText));

                if (newText.StartsWith("="))
                {
                    // Trigger recalculation for formulas
                    calculationService.RecalculateCell(currentWorksheet, currentCellAddress);
                }
            }
        }

        private void OnFormulaKeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                CommitFormula();
                // TODO: Move focus to worksheet
                e.Handled = true;
            }
            else if (e.Key == Key.Escape)
            {
                CancelFormulaEdit();
                e.Handled = true;
            }
        }

        private void CommitFormula()
        {
            if (currentWorksheet != null && currentCellAddress != null)
            {
                string formulaText = FormulaTextBox.Text;
                currentWorksheet.SetCellValue(currentCellAddress, new CellValue(formulaText));
                calculationService.RecalculateCell(currentWorksheet, currentCellAddress);
                // TODO: Update UI to reflect changes
            }
        }

        private void CancelFormulaEdit()
        {
            if (currentWorksheet != null && currentCellAddress != null)
            {
                var originalValue = currentWorksheet.GetCellValue(currentCellAddress);
                FormulaTextBox.Text = originalValue.ToString();
                // TODO: Move focus back to worksheet
            }
        }
    }
}