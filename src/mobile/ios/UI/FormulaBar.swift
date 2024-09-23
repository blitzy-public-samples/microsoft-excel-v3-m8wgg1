import SwiftUI

struct FormulaBar: View {
    @ObservedObject var workbookService: WorkbookService
    @ObservedObject var calculationService: CalculationService
    @Binding var currentWorksheet: IWorksheet?
    @Binding var selectedCell: CellAddress?
    @State private var formulaText: String = ""

    init(workbookService: WorkbookService, calculationService: CalculationService, currentWorksheet: Binding<IWorksheet?>, selectedCell: Binding<CellAddress?>) {
        self.workbookService = workbookService
        self.calculationService = calculationService
        self._currentWorksheet = currentWorksheet
        self._selectedCell = selectedCell
    }

    var body: some View {
        HStack {
            Text("fx")
                .font(.headline)
                .foregroundColor(.gray)
                .padding(.leading, 8)

            TextField("Enter formula", text: $formulaText, onCommit: commitFormula)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal, 8)
                .onChange(of: selectedCell) { _ in
                    updateFormulaBar()
                }
        }
        .frame(height: 44)
        .background(Color(.systemBackground))
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(.gray)
                .opacity(0.3),
            alignment: .bottom
        )
    }

    private func updateFormulaBar() {
        guard let worksheet = currentWorksheet, let cellAddress = selectedCell else {
            formulaText = ""
            return
        }

        if let cellValue = worksheet.getCellValue(at: cellAddress) {
            if cellValue.isFormula {
                formulaText = "=" + cellValue.formula
            } else {
                formulaText = cellValue.displayValue
            }
        } else {
            formulaText = ""
        }
    }

    private func commitFormula() {
        guard let worksheet = currentWorksheet, let cellAddress = selectedCell else { return }

        let newValue: CellValue
        if formulaText.starts(with: "=") {
            newValue = CellValue(formula: String(formulaText.dropFirst()))
        } else {
            newValue = CellValue(value: formulaText)
        }

        workbookService.updateCell(in: worksheet, at: cellAddress, with: newValue)
        calculationService.recalculateWorksheet(worksheet)
        
        // Trigger UI update
        updateFormulaBar()
    }

    private func cancelFormulaEdit() {
        updateFormulaBar()
        // TODO: Implement logic to clear focus from the formula bar
    }
}