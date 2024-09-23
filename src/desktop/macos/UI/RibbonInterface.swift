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
    @State private var selectedTab = 0
    
    init(workbookService: WorkbookService, visualizationService: VisualizationService) {
        self.workbookService = workbookService
        self.visualizationService = visualizationService
    }
    
    var body: some View {
        VStack {
            Picker("", selection: $selectedTab) {
                Text("Home").tag(0)
                Text("Insert").tag(1)
            }
            .pickerStyle(SegmentedPickerStyle())
            .padding()
            
            TabView(selection: $selectedTab) {
                homeTab.tag(0)
                insertTab.tag(1)
            }
        }
    }
    
    var homeTab: some View {
        VStack {
            HStack {
                // Clipboard group
                Button("Paste") { /* Implement paste action */ }
                Button("Cut") { /* Implement cut action */ }
                Button("Copy") { /* Implement copy action */ }
            }
            .padding()
            
            HStack {
                // Font group
                Picker("Font", selection: $selectedFontFamily) {
                    // Add font options
                }
                Picker("Size", selection: $selectedFontSize) {
                    // Add font size options
                }
                Toggle("B", isOn: $isBoldSelected)
                Toggle("I", isOn: $isItalicSelected)
            }
            .padding()
        }
    }
    
    var insertTab: some View {
        HStack {
            // Charts group
            Button("Column Chart") {
                insertColumnChart()
            }
            Button("Pie Chart") {
                insertPieChart()
            }
        }
        .padding()
    }
    
    func createNewWorkbook() {
        do {
            try workbookService.createNewWorkbook()
            // Update UI to reflect new workbook
        } catch {
            // Handle error and show alert
        }
    }
    
    func openWorkbook() {
        // Show file picker
        // Once file is selected:
        do {
            try workbookService.openWorkbook(/* file URL */)
            // Update UI to reflect opened workbook
        } catch {
            // Handle error and show alert
        }
    }
    
    func saveWorkbook() {
        do {
            try workbookService.saveWorkbook()
            // Show success message
        } catch {
            // Handle error and show alert
        }
    }
    
    func insertColumnChart() {
        guard let selectedRange = workbookService.getSelectedRange() else {
            // Show alert that no range is selected
            return
        }
        
        do {
            try visualizationService.createChart(type: .column, range: selectedRange)
            // Update UI to show new chart
        } catch {
            // Handle error and show alert
        }
    }
    
    func insertPieChart() {
        guard let selectedRange = workbookService.getSelectedRange() else {
            // Show alert that no range is selected
            return
        }
        
        do {
            try visualizationService.createChart(type: .pie, range: selectedRange)
            // Update UI to show new chart
        } catch {
            // Handle error and show alert
        }
    }
}