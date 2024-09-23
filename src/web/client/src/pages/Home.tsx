import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { AuthContext } from '../contexts/AuthContext';
import { WorkbookContext } from '../contexts/WorkbookContext';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const WelcomeMessage = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  background-color: #0078d4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #106ebe;
  }
`;

const RecentWorkbooksList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const WorkbookItem = styled.li`
  margin-bottom: 0.5rem;
`;

const TemplateSection = styled.div`
  margin-top: 2rem;
`;

const ResourcesSection = styled.div`
  margin-top: 2rem;
`;

export const Home: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { recentWorkbooks, createWorkbook, openWorkbook } = useContext(WorkbookContext);

  const createNewWorkbook = () => {
    const newWorkbook = createWorkbook();
    // Redirect to the new workbook page
    // This is a placeholder and should be replaced with actual navigation logic
    console.log('Redirecting to new workbook:', newWorkbook);
  };

  const openExistingWorkbook = (workbookId: string) => {
    openWorkbook(workbookId);
    // Redirect to the opened workbook page
    // This is a placeholder and should be replaced with actual navigation logic
    console.log('Redirecting to workbook:', workbookId);
  };

  return (
    <HomeContainer>
      <WelcomeMessage>Welcome, {user?.name || 'Guest'}!</WelcomeMessage>
      
      <div>
        <ActionButton onClick={createNewWorkbook}>Create New Workbook</ActionButton>
        <ActionButton as="label" htmlFor="file-upload">Open Workbook</ActionButton>
        <input id="file-upload" type="file" style={{ display: 'none' }} onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            // Handle file opening logic here
            console.log('Opening file:', file.name);
          }
        }} />
      </div>

      <RecentWorkbooksList>
        <h2>Recent Workbooks</h2>
        {recentWorkbooks.map((workbook) => (
          <WorkbookItem key={workbook.id}>
            <Link to={`/workbook/${workbook.id}`}>{workbook.name}</Link>
          </WorkbookItem>
        ))}
      </RecentWorkbooksList>

      <TemplateSection>
        <h2>Templates</h2>
        {/* Add template options here */}
      </TemplateSection>

      <ResourcesSection>
        <h2>Learning Resources</h2>
        {/* Add links to Excel tutorials and resources */}
      </ResourcesSection>
    </HomeContainer>
  );
};