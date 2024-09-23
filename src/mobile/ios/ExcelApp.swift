import SwiftUI
import WorkbookService
import AuthService
import CalculationService
import VisualizationService
import CollaborationService
import RibbonInterface
import WorksheetGrid
import FormulaBar

@main
struct ExcelApp: App {
    @StateObject private var workbookService = WorkbookService()
    @StateObject private var authService = AuthService()
    @StateObject private var calculationService = CalculationService()
    @StateObject private var visualizationService = VisualizationService()
    @StateObject private var collaborationService = CollaborationService()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(workbookService)
                .environmentObject(authService)
                .environmentObject(calculationService)
                .environmentObject(visualizationService)
                .environmentObject(collaborationService)
        }
    }

    init() {
        // Initialize core services
        workbookService.configure()
        authService.configure()
        calculationService.configure()
        visualizationService.configure()
        collaborationService.configure()

        // Set up app-wide configurations
        setupAppearance()
        setupDeepLinking()
    }

    private func setupAppearance() {
        // Configure app-wide appearance settings
        UINavigationBar.appearance().largeTitleTextAttributes = [.foregroundColor: UIColor.systemBlue]
        UITableView.appearance().backgroundColor = .systemBackground
    }

    private func setupDeepLinking() {
        // Configure deep linking handlers
    }
}

struct ContentView: View {
    @EnvironmentObject var workbookService: WorkbookService
    @EnvironmentObject var authService: AuthService

    var body: some View {
        if authService.isAuthenticated {
            MainView()
        } else {
            LoginView()
        }
    }
}

struct MainView: View {
    var body: some View {
        NavigationView {
            RibbonInterface()
            WorksheetGrid()
            FormulaBar()
        }
    }
}

struct LoginView: View {
    var body: some View {
        Text("Login View")
        // Implement login UI
    }
}