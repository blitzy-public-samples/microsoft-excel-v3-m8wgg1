import React, { useState, useEffect, useContext } from 'react';
import styled from '@emotion/styled';
import { WorkbookContext } from '../contexts/WorkbookContext';
import { CalculationContext } from '../contexts/CalculationContext';
import { CellAddress } from '../../../shared/types/CellAddress';
import { CellValue } from '../../../shared/types/CellValue';

const FormulaBarContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  background-color: #f1f1f1;
  border-bottom: 1px solid #ccc;
`;

const FormulaLabel = styled.span`
  font-weight: bold;
  margin-right: 10px;
`;

const FormulaInput = styled.input`
  flex-grow: 1;
  padding: 5px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

export const FormulaBar: React.FC = () => {
  const { activeWorksheet, selectedCell, updateCellValue } = useContext(WorkbookContext);
  const { recalculate } = useContext(CalculationContext);
  const [formulaText, setFormulaText] = useState('');

  useEffect(() => {
    if (activeWorksheet && selectedCell) {
      updateFormulaBar(selectedCell);
    }
  }, [activeWorksheet, selectedCell]);

  const updateFormulaBar = (cellAddress: CellAddress) => {
    const cellValue = activeWorksheet?.getCellValue(cellAddress);
    if (typeof cellValue === 'string' && cellValue.startsWith('=')) {
      setFormulaText(cellValue);
    } else {
      setFormulaText(cellValue?.toString() || '');
    }
  };

  const commitFormula = () => {
    if (activeWorksheet && selectedCell) {
      let newValue: CellValue = formulaText;
      if (formulaText.startsWith('=')) {
        newValue = { formula: formulaText };
      }
      updateCellValue(selectedCell, newValue);
      recalculate(activeWorksheet);
    }
  };

  const handleFormulaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormulaText(event.target.value);
  };

  const handleFormulaKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      commitFormula();
    } else if (event.key === 'Escape') {
      updateFormulaBar(selectedCell!);
    }
  };

  return (
    <FormulaBarContainer>
      <FormulaLabel>fx</FormulaLabel>
      <FormulaInput
        value={formulaText}
        onChange={handleFormulaChange}
        onKeyDown={handleFormulaKeyDown}
        placeholder="Enter a formula or value"
      />
    </FormulaBarContainer>
  );
};