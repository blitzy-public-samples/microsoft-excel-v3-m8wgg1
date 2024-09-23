import SwiftUI
import WorkbookService
import CalculationService
import IWorksheet
import CellAddress
import CellValue

struct WorksheetGrid: View {
    @ObservedObject var workbookService: WorkbookService
    @ObservedObject var calculationService: CalculationService
    @State private var currentWorksheet: IWorksheet?
    @State private var rowCount: Int = 1000
    @State private var columnCount: Int = 26
    @State private var cellWidth: CGFloat = 100
    @State private var cellHeight: CGFloat = 25
    @State private var selectedCell: CellAddress?

    init(workbookService: WorkbookService, calculationService: CalculationService) {
        self.workbookService = workbookService
        self.calculationService = calculationService
        // Set up any necessary observers or bindings
    }

    var body: some View {
        ScrollView([.horizontal, .vertical]) {
            LazyVGrid(columns: gridColumns, spacing: 0) {
                // Column headers
                ForEach(0..<columnCount, id: \.self) { column in
                    Text(columnLabel(column))
                        .frame(width: cellWidth, height: cellHeight)
                        .border(Color.gray, width: 0.5)
                }
                
                // Rows
                ForEach(0..<rowCount, id: \.self) { row in
                    // Row header
                    Text("\(row + 1)")
                        .frame(width: cellWidth, height: cellHeight)
                        .border(Color.gray, width: 0.5)
                    
                    // Cells
                    ForEach(0..<columnCount, id: \.self) { column in
                        cellView(row: row, column: column)
                    }
                }
            }
        }
    }

    private var gridColumns: [GridItem] {
        [GridItem(.fixed(cellWidth))] + Array(repeating: GridItem(.fixed(cellWidth)), count: columnCount)
    }

    private func columnLabel(_ column: Int) -> String {
        let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        var label = ""
        var num = column
        while num >= 0 {
            label = String(letters[letters.index(letters.startIndex, offsetBy: num % 26)]) + label
            num = num / 26 - 1
        }
        return label
    }

    private func cellView(row: Int, column: Int) -> some View {
        let cellAddress = CellAddress(row: row, column: column)
        let cellValue = currentWorksheet?.getCellValue(cellAddress) ?? ""

        return TextField("", text: Binding(
            get: { cellValue },
            set: { self.updateCellValue(cellAddress: cellAddress, newValue: $0) }
        ))
        .frame(width: cellWidth, height: cellHeight)
        .border(Color.gray, width: 0.5)
        .background(selectedCell == cellAddress ? Color.blue.opacity(0.1) : Color.white)
        .onTapGesture {
            self.selectCell(cellAddress: cellAddress)
        }
    }

    private func updateCellValue(cellAddress: CellAddress, newValue: String) {
        guard let worksheet = currentWorksheet else { return }
        worksheet.setCellValue(cellAddress, newValue)
        calculationService.recalculateWorksheet(worksheet)
        // Update dependent cells and refresh UI
        refreshGrid()
    }

    private func selectCell(cellAddress: CellAddress) {
        selectedCell = cellAddress
        // Notify observers of selection change
    }

    private func refreshGrid() {
        // Fetch latest worksheet data
        if let worksheet = workbookService.getCurrentWorksheet() {
            currentWorksheet = worksheet
            rowCount = worksheet.rowCount
            columnCount = worksheet.columnCount
        }
        // Trigger UI update
    }
}

// Preview provider for SwiftUI canvas
struct WorksheetGrid_Previews: PreviewProvider {
    static var previews: some View {
        WorksheetGrid(workbookService: WorkbookService(), calculationService: CalculationService())
    }
}