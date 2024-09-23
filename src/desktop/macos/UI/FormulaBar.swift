import SwiftUI
import WorkbookService
import CalculationService
import IWorksheet
import CellAddress
import CellValue

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
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(.gray)
                .frame(width: 30)
            
            TextField("", text: $formulaText, onCommit: commitFormula)
                .textFieldStyle(PlainTextFieldStyle())
                .font(.system(size: 14))
                .padding(4)
                .background(Color(.textBackgroundColor))
                .cornerRadius(4)
                .onChange(of: selectedCell) { _ in updateFormulaBar() }
        }
        .frame(height: 30)
        .padding(.horizontal, 8)
        .background(Color(.controlBackgroundColor))
    }
    
    private func updateFormulaBar() {
        guard let worksheet = currentWorksheet, let cellAddress = selectedCell else {
            formulaText = ""
            return
        }
        
        if let cellValue = worksheet.getCellValue(at: cellAddress) {
            switch cellValue {
            case .formula(let formula):
                formulaText = "=" + formula
            case .value(let value):
                formulaText = String(describing: value)
            }
        } else {
            formulaText = ""
        }
    }
    
    private func commitFormula() {
        guard let worksheet = currentWorksheet, let cellAddress = selectedCell else { return }
        
        let newValue: CellValue
        if formulaText.starts(with: "=") {
            newValue = .formula(String(formulaText.dropFirst()))
        } else {
            newValue = .value(formulaText)
        }
        
        worksheet.setCellValue(at: cellAddress, value: newValue)
        calculationService.recalculateWorksheet(worksheet)
        workbookService.updateWorksheet(worksheet)
    }
    
    private func cancelFormulaEdit() {
        updateFormulaBar()
        // TODO: Implement logic to clear focus from the formula bar
    }
}