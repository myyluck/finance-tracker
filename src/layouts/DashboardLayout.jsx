import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";

import './DashboardLayout.css';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="layout-container">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''
          }`}
        onClick={toggleSidebar}
      />

      <div className="main-content">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;