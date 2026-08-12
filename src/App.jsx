import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import DashboardLayout from './layouts/DashboardLayout';

// Pages
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const History = lazy(() => import('./pages/History/History'));
const Statistics = lazy(() => import('./pages/Statistics/Statistics'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const Reports = lazy(() => import('./pages/Reports/Reports'));
const Goals = lazy(() => import('./pages/Goals/Goals'));

const App = () => {
  return (
    <Suspense fallback={<div>Memuat halaman...</div>}>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="history" element={<History />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="goals" element={<Goals />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;