import { IWorkbook, IWorksheet, ICell, IFormula } from '../shared/interfaces';
import { CellAddress, CellValue } from '../shared/types';
import { Formula } from '../models/Formula';

export class CalculationService {
    private dependencyGraph: Map<string, Set<CellAddress>>;

    constructor() {
        this.dependencyGraph = new Map();
    }

    async calculateFormula(formula: IFormula, worksheet: IWorksheet): Promise<CellValue> {
        // TODO: Implement robust formula parsing and evaluation
        const parsedFormula = new Formula(formula.expression);
        
        // Placeholder implementation
        const result = await parsedFormula.evaluate((cellRef) => {
            return worksheet.getCell(cellRef).value;
        });

        return result;
    }

    async updateCell(cell: ICell, newValue: CellValue, worksheet: IWorksheet): Promise<void> {
        cell.value = newValue;

        if (cell.formula) {
            const calculatedValue = await this.calculateFormula(cell.formula, worksheet);
            cell.value = calculatedValue;
        }

        this.updateDependencyGraph(cell.address, cell.formula);
        await this.recalculateDependentCells(cell.address, worksheet);
    }

    async recalculateWorksheet(worksheet: IWorksheet): Promise<void> {
        const formulaCells = worksheet.getCellsWithFormulas();
        const sortedCells = this.sortCellsByDependency(formulaCells);

        for (const cell of sortedCells) {
            await this.calculateFormula(cell.formula, worksheet);
        }
    }

    async recalculateWorkbook(workbook: IWorkbook): Promise<void> {
        for (const worksheet of workbook.worksheets) {
            await this.recalculateWorksheet(worksheet);
        }
    }

    updateDependencyGraph(cellAddress: CellAddress, formula: IFormula | null): void {
        if (formula) {
            const dependencies = formula.getCellReferences();
            for (const dep of dependencies) {
                if (!this.dependencyGraph.has(dep.toString())) {
                    this.dependencyGraph.set(dep.toString(), new Set());
                }
                this.dependencyGraph.get(dep.toString())!.add(cellAddress);
            }
        }
    }

    getDependentCells(cellAddress: CellAddress): Set<CellAddress> {
        return this.dependencyGraph.get(cellAddress.toString()) || new Set();
    }

    private async recalculateDependentCells(cellAddress: CellAddress, worksheet: IWorksheet): Promise<void> {
        const dependentCells = this.getDependentCells(cellAddress);
        for (const depAddress of dependentCells) {
            const cell = worksheet.getCell(depAddress);
            if (cell.formula) {
                const calculatedValue = await this.calculateFormula(cell.formula, worksheet);
                cell.value = calculatedValue;
                await this.recalculateDependentCells(depAddress, worksheet);
            }
        }
    }

    private sortCellsByDependency(cells: ICell[]): ICell[] {
        // TODO: Implement topological sort algorithm
        return cells;
    }
}