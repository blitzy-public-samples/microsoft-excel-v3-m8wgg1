import React, { useState, useContext } from 'react';
import styled from '@emotion/styled';
import { WorkbookContext } from '../contexts/WorkbookContext';
import { VisualizationContext } from '../contexts/VisualizationContext';
import { ChartType } from '../../../shared/enums/ChartType';

// Styled components for ribbon layout
const RibbonContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f3f3f3;
  border-bottom: 1px solid #d1d1d1;
`;

const TabContainer = styled.div`
  display: flex;
`;

const Tab = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.active ? '#fff' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#217346' : 'transparent'};
  cursor: pointer;
  &:hover {
    background-color: #e6e6e6;
  }
`;

const GroupContainer = styled.div`
  display: flex;
  padding: 8px;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
`;

const Button = styled.button`
  padding: 4px 8px;
  background-color: #fff;
  border: 1px solid #d1d1d1;
  cursor: pointer;
  &:hover {
    background-color: #e6e6e6;
  }
`;

const Select = styled.select`
  padding: 4px;
`;

export const RibbonInterface: React.FC = () => {
  const workbookContext = useContext(WorkbookContext);
  const visualizationContext = useContext(VisualizationContext);

  const [activeTab, setActiveTab] = useState('Home');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('11');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const handleNewWorkbook = () => {
    workbookContext.createNewWorkbook();
  };

  const handleOpenWorkbook = () => {
    workbookContext.openWorkbook();
  };

  const handleSaveWorkbook = () => {
    workbookContext.saveWorkbook();
  };

  const handleInsertChart = (chartType: ChartType) => {
    visualizationContext.createChart(chartType);
  };

  return (
    <RibbonContainer>
      <TabContainer>
        <Tab active={activeTab === 'Home'} onClick={() => setActiveTab('Home')}>Home</Tab>
        <Tab active={activeTab === 'Insert'} onClick={() => setActiveTab('Insert')}>Insert</Tab>
        {/* Add more tabs here */}
      </TabContainer>
      
      {activeTab === 'Home' && (
        <GroupContainer>
          <Group>
            <Button onClick={handleNewWorkbook}>New</Button>
            <Button onClick={handleOpenWorkbook}>Open</Button>
            <Button onClick={handleSaveWorkbook}>Save</Button>
          </Group>
          <Group>
            <Select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
              <option value="Arial">Arial</option>
              <option value="Calibri">Calibri</option>
              <option value="Times New Roman">Times New Roman</option>
            </Select>
            <Select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
              {[8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </Select>
          </Group>
          <Group>
            <Button onClick={() => setIsBold(!isBold)}>B</Button>
            <Button onClick={() => setIsItalic(!isItalic)}>I</Button>
          </Group>
        </GroupContainer>
      )}

      {activeTab === 'Insert' && (
        <GroupContainer>
          <Group>
            <Button onClick={() => handleInsertChart(ChartType.Column)}>Column Chart</Button>
            <Button onClick={() => handleInsertChart(ChartType.Pie)}>Pie Chart</Button>
            {/* Add more chart types here */}
          </Group>
        </GroupContainer>
      )}
    </RibbonContainer>
  );
};