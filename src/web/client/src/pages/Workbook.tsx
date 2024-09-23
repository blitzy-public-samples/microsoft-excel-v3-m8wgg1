import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';

import { WorkbookContext } from '../contexts/WorkbookContext';
import { CalculationContext } from '../contexts/CalculationContext';
import { VisualizationContext } from '../contexts/VisualizationContext';
import { RibbonInterface } from '../components/RibbonInterface';
import { WorksheetGrid } from '../components/WorksheetGrid';
import { FormulaBar } from '../components/FormulaBar';
import { ChartControls } from '../components/ChartControls';
import { IWorkbook } from '../../../shared/interfaces/IWorkbook';
import { CellAddress, CellValue } from '../../../shared/types';

const WorkbookContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const SidePanel = styled.div`
  width: 300px;
  border-left: 1px solid #ccc;
`;

export const Workbook: React.FC = () => {
  const { workbookId } = useParams<{ workbookId: string }>();
  const [workbook, setWorkbook] = useState<IWorkbook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const workbookContext = useContext(WorkbookContext);
  const calculationContext = useContext(CalculationContext);
  const visualizationContext = useContext(VisualizationContext);

  useEffect(() => {
    loadWorkbook(workbookId);
  }, [workbookId]);

  const loadWorkbook = async (id: string) => {
    try {
      setIsLoading(true);
      const loadedWorkbook = await workbookContext.getWorkbook(id);
      setWorkbook(loadedWorkbook);
      calculationContext.initializeWorkbook(loadedWorkbook);
      visualizationContext.initializeWorkbook(loadedWorkbook);
    } catch (err) {
      setError('Failed to load workbook. Please try again.');
      console.error('Error loading workbook:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWorkbook = async () => {
    if (!workbook) return;
    try {
      await workbookContext.saveWorkbook(workbook);
      // Show save confirmation to the user
      console.log('Workbook saved successfully');
    } catch (err) {
      console.error('Error saving workbook:', err);
      // Show error message to the user
    }
  };

  const handleCellChange = (cellAddress: CellAddress, newValue: CellValue) => {
    if (!workbook) return;
    const updatedWorkbook = workbookContext.updateCell(workbook, cellAddress, newValue);
    setWorkbook(updatedWorkbook);
    calculationContext.recalculate(updatedWorkbook, cellAddress);
    visualizationContext.updateCharts(updatedWorkbook, cellAddress);
    // Mark workbook as having unsaved changes
  };

  if (isLoading) {
    return <div>Loading workbook...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!workbook) {
    return <div>No workbook found</div>;
  }

  return (
    <WorkbookContainer>
      <RibbonInterface onSave={saveWorkbook} />
      <FormulaBar />
      <MainContent>
        <WorksheetGrid
          workbook={workbook}
          onCellChange={handleCellChange}
        />
        <SidePanel>
          <ChartControls />
        </SidePanel>
      </MainContent>
    </WorkbookContainer>
  );
};