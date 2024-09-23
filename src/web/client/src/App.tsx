import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { WorkbookProvider } from './contexts/WorkbookContext';
import { CalculationProvider } from './contexts/CalculationContext';
import { VisualizationProvider } from './contexts/VisualizationContext';
import Home from './pages/Home';
import Workbook from './pages/Workbook';
import GlobalStyles from './styles/GlobalStyles';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <WorkbookProvider>
        <CalculationProvider>
          <VisualizationProvider>
            <BrowserRouter>
              <GlobalStyles />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/workbook/:id" element={<Workbook />} />
              </Routes>
            </BrowserRouter>
          </VisualizationProvider>
        </CalculationProvider>
      </WorkbookProvider>
    </AuthProvider>
  );
};

export default App;