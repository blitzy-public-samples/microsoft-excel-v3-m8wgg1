#include "VisualizationEngine.h"
#include "Chart.h"
#include "CellRange.h"
#include "Worksheet.h"
#include "DataManagementService.h"
#include <vector>
#include <memory>
#include <string>
#include <unordered_map>
#include <stdexcept>

const int MAX_CHART_ELEMENTS = 1000;

VisualizationEngine::VisualizationEngine(std::unique_ptr<DataManagementService> dataManagementService)
    : dataManagementService(std::move(dataManagementService)) {
    // Initialize the charts unordered_map
    charts = std::unordered_map<std::string, std::unique_ptr<Chart>>();
}

std::unique_ptr<Chart> VisualizationEngine::createChart(const std::string& workbookId, const std::string& worksheetId,
                                                        ChartType type, const CellRange& dataRange, const CellAddress& position) {
    // Validate input parameters
    if (workbookId.empty() || worksheetId.empty() || dataRange.isEmpty()) {
        throw std::invalid_argument("Invalid input parameters for chart creation");
    }

    // Fetch data for the chart from DataManagementService
    auto chartData = dataManagementService->getChartData(workbookId, worksheetId, dataRange);

    // Create a new Chart object
    auto newChart = std::make_unique<Chart>(type, dataRange, position);

    // Generate the initial chart visualization
    newChart->generateVisualization(chartData);

    // Add the chart to the charts unordered_map
    std::string chartId = newChart->getId();
    charts[chartId] = std::move(newChart);

    // Return the created chart
    return std::move(charts[chartId]);
}

void VisualizationEngine::updateChart(const std::string& chartId, const ChartProperties& properties) {
    // Find the chart in the charts unordered_map
    auto chartIt = charts.find(chartId);
    if (chartIt == charts.end()) {
        throw std::runtime_error("Chart not found");
    }

    Chart* chart = chartIt->second.get();

    // Update the chart properties
    chart->updateProperties(properties);

    // Fetch new data if the data range has changed
    if (properties.dataRangeChanged) {
        auto newData = dataManagementService->getChartData(chart->getWorkbookId(), chart->getWorksheetId(), chart->getDataRange());
        chart->updateData(newData);
    }

    // Regenerate the chart visualization
    chart->regenerateVisualization();
}

std::vector<unsigned char> VisualizationEngine::renderChart(const std::string& chartId, RenderFormat format) {
    // Find the chart in the charts unordered_map
    auto chartIt = charts.find(chartId);
    if (chartIt == charts.end()) {
        throw std::runtime_error("Chart not found");
    }

    Chart* chart = chartIt->second.get();

    // Apply any pending updates or customizations
    chart->applyPendingUpdates();

    // Render the chart in the specified format
    return chart->render(format);
}

bool VisualizationEngine::deleteChart(const std::string& chartId) {
    // Find the chart in the charts unordered_map
    auto chartIt = charts.find(chartId);
    if (chartIt == charts.end()) {
        return false;
    }

    // Remove the chart from the unordered_map
    charts.erase(chartIt);

    // Clean up any associated resources
    // (assuming Chart destructor handles resource cleanup)

    return true;
}

void VisualizationEngine::updateChartData(const std::string& chartId, const CellRange& newDataRange) {
    // Find the chart in the charts unordered_map
    auto chartIt = charts.find(chartId);
    if (chartIt == charts.end()) {
        throw std::runtime_error("Chart not found");
    }

    Chart* chart = chartIt->second.get();

    // Fetch new data from DataManagementService
    auto newData = dataManagementService->getChartData(chart->getWorkbookId(), chart->getWorksheetId(), newDataRange);

    // Update the chart's data
    chart->updateData(newData);

    // Regenerate the chart visualization
    chart->regenerateVisualization();
}

void VisualizationEngine::applyChartStyle(const std::string& chartId, ChartStyle style) {
    // Find the chart in the charts unordered_map
    auto chartIt = charts.find(chartId);
    if (chartIt == charts.end()) {
        throw std::runtime_error("Chart not found");
    }

    Chart* chart = chartIt->second.get();

    // Apply the specified style to the chart
    chart->applyStyle(style);

    // Update the chart visualization
    chart->regenerateVisualization();
}