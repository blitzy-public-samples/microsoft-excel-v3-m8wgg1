#include "CalculationEngine.h"
#include "../models/Formula.h"
#include "../models/Cell.h"
#include "../models/Worksheet.h"
#include "./ExcelFunctions.h"
#include <vector>
#include <unordered_map>
#include <stack>
#include <memory>
#include <stdexcept>

const int MAX_ITERATION_COUNT = 1000; // Adjust this value as needed

CalculationEngine::CalculationEngine() : 
    dependencyGraph(),
    excelFunctions(std::make_unique<ExcelFunctions>()) {
    // Initialize the dependencyGraph if needed
}

CellValue CalculationEngine::calculateFormula(const Formula& formula, const Worksheet& worksheet) {
    // TODO: Implement formula parsing and evaluation
    // 1. Parse the formula expression
    // 2. Build an evaluation tree
    // 3. Traverse the tree and evaluate each node
    // 4. Handle cell references by fetching values from the worksheet
    // 5. Perform calculations using ExcelFunctions
    // 6. Return the final result

    // Placeholder implementation
    return CellValue(); // Return a default CellValue
}

void CalculationEngine::updateCell(Cell& cell, const CellValue& newValue, Worksheet& worksheet) {
    cell.setValue(newValue);

    if (cell.hasFormula()) {
        // Recalculate the cell's formula
        CellValue result = calculateFormula(cell.getFormula(), worksheet);
        cell.setValue(result);
    }

    // Update dependency graph
    updateDependencyGraph(cell.getAddress(), cell.getFormula());

    // Identify and recalculate dependent cells
    std::vector<std::string> dependentCells = getDependentCells(cell.getAddress());
    for (const auto& dependentCell : dependentCells) {
        // TODO: Implement recalculation of dependent cells
    }
}

void CalculationEngine::recalculateWorksheet(Worksheet& worksheet) {
    // TODO: Implement worksheet recalculation
    // 1. Identify all cells with formulas in the worksheet
    // 2. Build a dependency graph for the entire worksheet
    // 3. Perform a topological sort on the dependency graph
    // 4. Recalculate cells in the sorted order
}

void CalculationEngine::updateDependencyGraph(const std::string& cellAddress, const Formula& formula) {
    // TODO: Implement dependency graph update
    // 1. Extract cell references from the formula
    // 2. Update the dependencyGraph with the new dependencies
}

bool CalculationEngine::detectCircularReference(const std::string& startCell) {
    std::unordered_set<std::string> visited;
    std::stack<std::string> path;

    return detectCircularReferenceHelper(startCell, visited, path);
}

bool CalculationEngine::detectCircularReferenceHelper(const std::string& currentCell, 
                                                      std::unordered_set<std::string>& visited, 
                                                      std::stack<std::string>& path) {
    visited.insert(currentCell);
    path.push(currentCell);

    const auto& dependencies = dependencyGraph[currentCell];
    for (const auto& dependency : dependencies) {
        if (path.find(dependency) != path.end()) {
            // Circular reference detected
            return true;
        }

        if (visited.find(dependency) == visited.end()) {
            if (detectCircularReferenceHelper(dependency, visited, path)) {
                return true;
            }
        }
    }

    path.pop();
    return false;
}

std::vector<std::string> CalculationEngine::getDependentCells(const std::string& cellAddress) {
    // TODO: Implement getting dependent cells from the dependency graph
    return std::vector<std::string>();
}