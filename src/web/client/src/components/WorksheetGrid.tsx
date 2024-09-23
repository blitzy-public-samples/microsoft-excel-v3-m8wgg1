import React, { useState, useEffect, useContext } from 'react';
import styled from '@emotion/styled';
import { WorkbookContext } from '../contexts/WorkbookContext';
import { CalculationContext } from '../contexts/CalculationContext';
import { IWorksheet } from '../../../shared/interfaces/IWorksheet';
import { CellAddress } from '../../../shared/types/CellAddress';
import { CellValue } from '../../../shared/types/CellValue';

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
`;

const Cell = styled.div<{ isSelected: boolean }>`
  border: 1px solid #ccc;
  min-width: 100px;
  height: 25px;
  padding: 2px;
  display: flex;
  align-items: center;
  background-color: ${props => props.isSelected ? '#e6f2ff' : 'white'};
`;

const ColumnHeader = styled(Cell)`
  font-weight: bold;
  background-color: #f0f0f0;
`;

const RowHeader = styled(Cell)`
  font-weight: bold;
  background-color: #f0f0f0;
  min-width: 50px;
`;

interface CellComponentProps {
  cellAddress: CellAddress;
  value: CellValue;
  isSelected: boolean;
  onSelect: (cellAddress: CellAddress) => void;
  onChange: (cellAddress: CellAddress, newValue: CellValue) => void;
}

const CellComponent: React.FC<CellComponentProps> = ({ cellAddress, value, isSelected, onSelect, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(cellAddress, e.target.value);
  };

  return (
    <Cell isSelected={isSelected} onClick={() => onSelect(cellAddress)}>
      <input
        type="text"
        value={value as string}
        onChange={handleChange}
        style={{ width: '100%', border: 'none', background: 'transparent' }}
      />
    </Cell>
  );
};

export const WorksheetGrid: React.FC = () => {
  const { currentWorkbook } = useContext(WorkbookContext);
  const { recalculate } = useContext(CalculationContext);
  const [currentWorksheet, setCurrentWorksheet] = useState<IWorksheet | null>(null);
  const [selectedCell, setSelectedCell] = useState<CellAddress | null>(null);
  const [rowCount, setRowCount] = useState(100);
  const [columnCount, setColumnCount] = useState(26);

  useEffect(() => {
    if (currentWorkbook && currentWorkbook.worksheets.length > 0) {
      setCurrentWorksheet(currentWorkbook.worksheets[0]);
    }
  }, [currentWorkbook]);

  const updateCellValue = (cellAddress: CellAddress, newValue: CellValue) => {
    if (currentWorksheet) {
      const updatedWorksheet = {
        ...currentWorksheet,
        cells: {
          ...currentWorksheet.cells,
          [cellAddress.row]: {
            ...currentWorksheet.cells[cellAddress.row],
            [cellAddress.column]: newValue,
          },
        },
      };
      setCurrentWorksheet(updatedWorksheet);
      recalculate(updatedWorksheet);
    }
  };

  const handleCellSelect = (cellAddress: CellAddress) => {
    setSelectedCell(cellAddress);
  };

  const renderGrid = () => {
    const grid: JSX.Element[] = [];

    // Render column headers
    const columnHeaders = [''];
    for (let col = 0; col < columnCount; col++) {
      columnHeaders.push(String.fromCharCode(65 + col));
    }
    grid.push(
      <Row key="column-headers">
        {columnHeaders.map((header, index) => (
          <ColumnHeader key={`header-${index}`}>{header}</ColumnHeader>
        ))}
      </Row>
    );

    // Render rows
    for (let row = 0; row < rowCount; row++) {
      const cells: JSX.Element[] = [<RowHeader key={`row-${row}`}>{row + 1}</RowHeader>];
      for (let col = 0; col < columnCount; col++) {
        const cellAddress: CellAddress = { row, column: col };
        const cellValue = currentWorksheet?.cells[row]?.[col] || '';
        const isSelected = selectedCell?.row === row && selectedCell?.column === col;

        cells.push(
          <CellComponent
            key={`cell-${row}-${col}`}
            cellAddress={cellAddress}
            value={cellValue}
            isSelected={isSelected}
            onSelect={handleCellSelect}
            onChange={updateCellValue}
          />
        );
      }
      grid.push(<Row key={`row-${row}`}>{cells}</Row>);
    }

    return grid;
  };

  return <GridContainer>{renderGrid()}</GridContainer>;
};