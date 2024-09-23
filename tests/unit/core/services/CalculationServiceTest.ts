import { assert } from 'assert';
import { CalculationService } from '../../../../src/core/services/CalculationService';
import { Workbook } from '../../../../src/core/models/Workbook';
import { Worksheet } from '../../../../src/core/models/Worksheet';
import { Cell } from '../../../../src/core/models/Cell';
import { Formula } from '../../../../src/core/models/Formula';
import { CellAddress } from '../../../../src/shared/types/CellAddress';
import { CellValue } from '../../../../src/shared/types/CellValue';

describe('CalculationService', () => {
  let calculationService: CalculationService;
  let mockWorkbook: Workbook;

  beforeEach(() => {
    // Initialize a new CalculationService instance
    calculationService = new CalculationService();

    // Create a mock Workbook with a sample Worksheet
    mockWorkbook = new Workbook('TestWorkbook');
    const worksheet = new Worksheet('Sheet1');
    mockWorkbook.addWorksheet(worksheet);

    // Populate the Worksheet with some initial cell values
    worksheet.setCellValue({ row: 0, column: 0 }, 10);
    worksheet.setCellValue({ row: 0, column: 1 }, 20);
    worksheet.setCellValue({ row: 1, column: 0 }, 30);
  });

  it('should calculate a simple arithmetic formula correctly', async () => {
    const formula = new Formula('=A1 + B1');
    const result = await calculationService.calculateFormula(formula, mockWorkbook.getWorksheet('Sheet1'));
    assert.strictEqual(result, 30);
  });

  it('should update a cell value and recalculate dependent cells', async () => {
    const worksheet = mockWorkbook.getWorksheet('Sheet1');
    worksheet.setCellValue({ row: 2, column: 0 }, new Formula('=A1 + A2'));

    await calculationService.updateCell(worksheet.getCell({ row: 0, column: 0 }), 15);

    assert.strictEqual(worksheet.getCellValue({ row: 2, column: 0 }), 45);
  });

  it('should recalculate the entire worksheet correctly', async () => {
    const worksheet = mockWorkbook.getWorksheet('Sheet1');
    worksheet.setCellValue({ row: 2, column: 0 }, new Formula('=A1 + B1'));
    worksheet.setCellValue({ row: 2, column: 1 }, new Formula('=A2 * 2'));

    await calculationService.recalculateWorksheet(worksheet);

    assert.strictEqual(worksheet.getCellValue({ row: 2, column: 0 }), 30);
    assert.strictEqual(worksheet.getCellValue({ row: 2, column: 1 }), 60);
  });

  it('should update the dependency graph correctly', () => {
    const formula = new Formula('=A1 + B2');
    calculationService.updateDependencyGraph('C3', formula);

    const dependencies = calculationService.getDependentCells({ row: 0, column: 0 });
    assert(dependencies.has('C3'));
  });

  it('should detect circular references', () => {
    const worksheet = mockWorkbook.getWorksheet('Sheet1');
    worksheet.setCellValue({ row: 0, column: 0 }, new Formula('=B1'));
    worksheet.setCellValue({ row: 0, column: 1 }, new Formula('=A1'));

    const hasCircularReference = calculationService.detectCircularReference({ row: 0, column: 0 });
    assert.strictEqual(hasCircularReference, true);
  });

  it('should handle complex formulas with multiple functions and cell references', async () => {
    const worksheet = mockWorkbook.getWorksheet('Sheet1');
    worksheet.setCellValue({ row: 2, column: 0 }, new Formula('=SUM(A1:B1) * AVERAGE(A1:A2)'));

    const result = await calculationService.calculateFormula(worksheet.getCell({ row: 2, column: 0 }).formula, worksheet);
    assert.strictEqual(result, 600); // (10 + 20) * ((10 + 30) / 2) = 30 * 20 = 600
  });

  it('should handle error cases in formula calculation', async () => {
    const worksheet = mockWorkbook.getWorksheet('Sheet1');
    worksheet.setCellValue({ row: 2, column: 0 }, new Formula('=A1 / 0'));

    const result = await calculationService.calculateFormula(worksheet.getCell({ row: 2, column: 0 }).formula, worksheet);
    assert.strictEqual(result, '#DIV/0!');
  });

  // Add more tests here for other scenarios and edge cases
});