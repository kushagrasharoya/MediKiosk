import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CaseProvider } from './context/CaseContext';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import { AppRoutes } from './routes/AppRoutes';
import './i18n';

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <SettingsProvider>
            <CaseProvider>
              <AppRoutes />
            </CaseProvider>
          </SettingsProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
