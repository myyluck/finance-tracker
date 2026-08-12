import { NavLink } from "react-router-dom";
import {
  FiPieChart,
  FiList,
  FiTrendingUp,
  FiFileText,
  FiTarget,
  FiSettings,
  FiX,
} from "react-icons/fi";

import "./Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    {
      path: "/",
      name: "Dashboard",
      icon: <FiPieChart />,
    },
    {
      path: "/history",
      name: "Riwayat",
      icon: <FiList />,
    },
    {
      path: "/statistics",
      name: "Statistik",
      icon: <FiTrendingUp />,
    },
    {
      path: "/reports",
      name: "Laporan",
      icon: <FiFileText />,
    },
    {
      path: "/goals",
      name: "Target",
      icon: <FiTarget />,
    },
    {
      path: "/settings",
      name: "Pengaturan",
      icon: <FiSettings />,
    },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-icon">💸</div>

        <span>MyFinance</span>

        <button
          className="sidebar-close-btn"
          onClick={toggleSidebar}
          aria-label="Tutup sidebar"
        >
          <FiX />
        </button>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
            onClick={() => {
              if (window.innerWidth <= 992) {
                toggleSidebar();
              }
            }}
          >
            <span className="menu-icon">{item.icon}</span>

            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;