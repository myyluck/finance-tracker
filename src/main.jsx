import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';

import { ThemeProvider } from './context/ThemeContext';
import { FinanceProvider } from './context/FinanceContext';

import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <FinanceProvider>
          <App />
        </FinanceProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);