import SwiftUI
import Combine

struct WorksheetGrid: View {
    @ObservedObject var workbookService: WorkbookService
    @ObservedObject var calculationService: CalculationService
    
    @State private var currentWorksheet: IWorksheet?
    @State private var rowCount: Int = 1000
    @State private var columnCount: Int = 26
    @State private var cellWidth: CGFloat = 100
    @State private var cellHeight: CGFloat = 25
    @State private var selectedCell: CellAddress?
    @State private var scrollPosition: CGPoint = .zero
    
    init(workbookService: WorkbookService, calculationService: CalculationService) {
        self.workbookService = workbookService
        self.calculationService = calculationService
        
        // Set up observers or bindings here if needed
    }
    
    var body: some View {
        GeometryReader { geometry in
            ScrollView([.horizontal, .vertical]) {
                VStack(spacing: 0) {
                    // Column headers
                    HStack(spacing: 0) {
                        ForEach(0..<columnCount, id: \.self) { column in
                            Text(columnLabel(column))
                                .frame(width: cellWidth, height: cellHeight)
                                .border(Color.gray, width: 0.5)
                        }
                    }
                    
                    // Rows
                    LazyVStack(spacing: 0) {
                        ForEach(0..<rowCount, id: \.self) { row in
                            HStack(spacing: 0) {
                                // Row header
                                Text("\(row + 1)")
                                    .frame(width: cellWidth, height: cellHeight)
                                    .border(Color.gray, width: 0.5)
                                
                                // Cells
                                LazyHStack(spacing: 0) {
                                    ForEach(0..<columnCount, id: \.self) { column in
                                        cellView(row: row, column: column)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .gesture(MagnificationGesture()
                .onChanged { scale in
                    handlePinchToZoom(scale: scale)
                }
            )
        }
    }
    
    private func cellView(row: Int, column: Int) -> some View {
        let cellAddress = CellAddress(row: row, column: column)
        let cellValue = currentWorksheet?.getCellValue(at: cellAddress) ?? ""
        
        return TextField("", text: Binding(
            get: { cellValue },
            set: { updateCellValue(cellAddress: cellAddress, newValue: $0) }
        ))
        .frame(width: cellWidth, height: cellHeight)
        .border(Color.gray, width: 0.5)
        .background(selectedCell == cellAddress ? Color.blue.opacity(0.1) : Color.white)
        .onTapGesture {
            selectCell(cellAddress: cellAddress)
        }
    }
    
    private func updateCellValue(cellAddress: CellAddress, newValue: String) {
        guard let worksheet = currentWorksheet else { return }
        
        worksheet.setCellValue(at: cellAddress, value: newValue)
        calculationService.recalculateWorksheet(worksheet)
        refreshGrid()
    }
    
    private func selectCell(cellAddress: CellAddress) {
        selectedCell = cellAddress
        // Implement scrolling to make the selected cell visible if necessary
    }
    
    private func refreshGrid() {
        // Fetch latest worksheet data and update UI
        // This is a simplified implementation
        if let worksheet = workbookService.getCurrentWorksheet() {
            currentWorksheet = worksheet
            rowCount = worksheet.rowCount
            columnCount = worksheet.columnCount
        }
    }
    
    private func handlePinchToZoom(scale: CGFloat) {
        let newWidth = max(50, min(200, cellWidth * scale))
        let newHeight = max(20, min(100, cellHeight * scale))
        
        cellWidth = newWidth
        cellHeight = newHeight
        
        // Trigger a redraw of the grid
        refreshGrid()
    }
    
    private func columnLabel(_ column: Int) -> String {
        let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        var label = ""
        var num = column
        
        repeat {
            label = String(letters[letters.index(letters.startIndex, offsetBy: num % 26)]) + label
            num = num / 26 - 1
        } while num >= 0
        
        return label
    }
}