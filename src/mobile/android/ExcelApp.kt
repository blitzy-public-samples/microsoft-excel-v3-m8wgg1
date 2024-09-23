package com.microsoft.excel.android

import android.app.Application
import androidx.lifecycle.ProcessLifecycleOwner
import com.microsoft.excel.core.services.WorkbookService
import com.microsoft.excel.core.services.AuthService
import com.microsoft.excel.core.services.CalculationService
import com.microsoft.excel.core.services.VisualizationService
import com.microsoft.excel.core.services.CollaborationService
import com.microsoft.excel.android.utils.AppLifecycleObserver

class ExcelApp : Application() {

    lateinit var workbookService: WorkbookService
    lateinit var authService: AuthService
    lateinit var calculationService: CalculationService
    lateinit var visualizationService: VisualizationService
    lateinit var collaborationService: CollaborationService
    private lateinit var appLifecycleObserver: AppLifecycleObserver

    override fun onCreate() {
        super.onCreate()

        // Initialize core services
        initializeServices()

        // Set up AppLifecycleObserver
        appLifecycleObserver = AppLifecycleObserver()
        ProcessLifecycleOwner.get().lifecycle.addObserver(appLifecycleObserver)

        // Initialize configurations
        initializeConfigurations()

        // Set up error handling and crash reporting
        setupErrorHandling()
    }

    override fun onTerminate() {
        super.onTerminate()

        // Perform cleanup operations for services
        cleanupServices()

        // Unregister AppLifecycleObserver
        ProcessLifecycleOwner.get().lifecycle.removeObserver(appLifecycleObserver)

        // Release any held resources
        releaseResources()
    }

    private fun initializeServices() {
        workbookService = WorkbookService()
        authService = AuthService()
        calculationService = CalculationService()
        visualizationService = VisualizationService()
        collaborationService = CollaborationService()

        // Set up any necessary dependencies between services
        // For example:
        // calculationService.setWorkbookService(workbookService)
    }

    private fun initializeConfigurations() {
        // Initialize any necessary configurations
        // For example:
        // AppConfig.initialize(this)
    }

    private fun setupErrorHandling() {
        // Set up error handling and crash reporting
        // For example:
        // FirebaseCrashlytics.getInstance().setCrashlyticsCollectionEnabled(true)
    }

    private fun cleanupServices() {
        // Perform cleanup operations for services
        // For example:
        // workbookService.cleanup()
        // authService.cleanup()
        // ...
    }

    private fun releaseResources() {
        // Release any held resources
        // For example:
        // cacheManager.clearCache()
    }
}