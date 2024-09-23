import React, { useState, useContext } from 'react';
import styled from '@emotion/styled';
import { WorkbookContext } from '../contexts/WorkbookContext';
import { VisualizationContext } from '../contexts/VisualizationContext';
import { ChartType } from '../../../shared/enums/ChartType';
import { IChart } from '../../../shared/interfaces/IChart';
import { CellRange } from '../../../shared/types/CellRange';

const ControlsContainer = styled.div`
  padding: 16px;
  background-color: #f0f0f0;
  border-radius: 4px;
`;

const ChartTypeSelect = styled.select`
  margin-bottom: 8px;
  width: 100%;
  padding: 8px;
`;

const DataRangeInput = styled.input`
  margin-bottom: 8px;
  width: 100%;
  padding: 8px;
`;

const CreateChartButton = styled.button`
  background-color: #0078d4;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
`;

const ChartList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ChartListItem = styled.li`
  margin-bottom: 8px;
  padding: 8px;
  background-color: #ffffff;
  border-radius: 4px;
`;

export const ChartControls: React.FC = () => {
  const workbookContext = useContext(WorkbookContext);
  const visualizationContext = useContext(VisualizationContext);

  const [selectedChartType, setSelectedChartType] = useState<ChartType>(ChartType.Column);
  const [dataRange, setDataRange] = useState<string>('');
  const [charts, setCharts] = useState<IChart[]>([]);

  const createChart = () => {
    if (!dataRange) {
      alert('Please select a data range');
      return;
    }

    try {
      const range = CellRange.fromString(dataRange);
      const newChart = visualizationContext.createChart(selectedChartType, range);
      setCharts([...charts, newChart]);
    } catch (error) {
      alert('Invalid data range. Please use the format A1:B10');
    }
  };

  const updateChartType = (chartId: string, newType: ChartType) => {
    visualizationContext.updateChartType(chartId, newType);
    setCharts(charts.map(chart => 
      chart.id === chartId ? { ...chart, type: newType } : chart
    ));
  };

  const updateDataRange = (chartId: string, newRange: string) => {
    try {
      const range = CellRange.fromString(newRange);
      visualizationContext.updateDataRange(chartId, range);
      setCharts(charts.map(chart => 
        chart.id === chartId ? { ...chart, dataRange: range } : chart
      ));
    } catch (error) {
      alert('Invalid data range. Please use the format A1:B10');
    }
  };

  const deleteChart = (chartId: string) => {
    visualizationContext.deleteChart(chartId);
    setCharts(charts.filter(chart => chart.id !== chartId));
  };

  return (
    <ControlsContainer>
      <ChartTypeSelect 
        value={selectedChartType} 
        onChange={(e) => setSelectedChartType(e.target.value as ChartType)}
      >
        {Object.values(ChartType).map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </ChartTypeSelect>
      <DataRangeInput 
        value={dataRange} 
        onChange={(e) => setDataRange(e.target.value)}
        placeholder="Enter data range (e.g., A1:B10)"
      />
      <CreateChartButton onClick={createChart}>Create Chart</CreateChartButton>
      <ChartList>
        {charts.map(chart => (
          <ChartListItem key={chart.id}>
            <select 
              value={chart.type} 
              onChange={(e) => updateChartType(chart.id, e.target.value as ChartType)}
            >
              {Object.values(ChartType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input 
              value={chart.dataRange.toString()} 
              onChange={(e) => updateDataRange(chart.id, e.target.value)}
            />
            <button onClick={() => deleteChart(chart.id)}>Delete</button>
          </ChartListItem>
        ))}
      </ChartList>
    </ControlsContainer>
  );
};