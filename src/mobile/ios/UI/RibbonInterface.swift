import SwiftUI
import WorkbookService
import VisualizationService
import ChartType

struct RibbonInterface: View {
    @ObservedObject var workbookService: WorkbookService
    @ObservedObject var visualizationService: VisualizationService
    
    @State private var selectedFontFamily: String = "Helvetica"
    @State private var selectedFontSize: CGFloat = 12
    @State private var isBoldSelected: Bool = false
    @State private var isItalicSelected: Bool = false
    @State private var selectedTab: Int = 0
    
    init(workbookService: WorkbookService, visualizationService: VisualizationService) {
        self.workbookService = workbookService
        self.visualizationService = visualizationService
    }
    
    var body: some View {
        VStack {
            Picker("Tabs", selection: $selectedTab) {
                Text("Home").tag(0)
                Text("Insert").tag(1)
                // Add more tabs here
            }
            .pickerStyle(SegmentedPickerStyle())
            .padding()
            
            switch selectedTab {
            case 0:
                homeTab
            case 1:
                insertTab
            default:
                Text("Tab not implemented")
            }
        }
    }
    
    var homeTab: some View {
        VStack {
            HStack {
                Button(action: createNewWorkbook) {
                    Text("New")
                }
                Button(action: openWorkbook) {
                    Text("Open")
                }
                Button(action: saveWorkbook) {
                    Text("Save")
                }
            }
            .padding()
            
            HStack {
                Picker("Font", selection: $selectedFontFamily) {
                    Text("Helvetica").tag("Helvetica")
                    Text("Arial").tag("Arial")
                    Text("Times New Roman").tag("Times New Roman")
                }
                Picker("Size", selection: $selectedFontSize) {
                    Text("10").tag(CGFloat(10))
                    Text("12").tag(CGFloat(12))
                    Text("14").tag(CGFloat(14))
                }
                Toggle("B", isOn: $isBoldSelected)
                Toggle("I", isOn: $isItalicSelected)
            }
            .padding()
        }
    }
    
    var insertTab: some View {
        HStack {
            Button(action: insertColumnChart) {
                Text("Column Chart")
            }
            Button(action: insertPieChart) {
                Text("Pie Chart")
            }
        }
        .padding()
    }
    
    func createNewWorkbook() {
        do {
            try workbookService.createNewWorkbook()
        } catch {
            print("Error creating new workbook: \(error)")
            // Update UI to show error
        }
    }
    
    func openWorkbook() {
        let documentPicker = UIDocumentPickerViewController(documentTypes: ["com.microsoft.excel.xls"], in: .open)
        // Set up document picker delegate and present it
        // In the delegate method, call:
        // workbookService.openWorkbook(fileURL)
    }
    
    func saveWorkbook() {
        do {
            try workbookService.saveWorkbook()
        } catch {
            print("Error saving workbook: \(error)")
            // Update UI to show error
        }
    }
    
    func insertColumnChart() {
        guard let selectedRange = workbookService.getSelectedRange() else {
            print("No range selected")
            return
        }
        
        do {
            try visualizationService.createChart(type: .column, dataRange: selectedRange)
        } catch {
            print("Error inserting column chart: \(error)")
            // Update UI to show error
        }
    }
    
    func insertPieChart() {
        guard let selectedRange = workbookService.getSelectedRange() else {
            print("No range selected")
            return
        }
        
        do {
            try visualizationService.createChart(type: .pie, dataRange: selectedRange)
        } catch {
            print("Error inserting pie chart: \(error)")
            // Update UI to show error
        }
    }
}