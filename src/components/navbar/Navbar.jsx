import React from 'react';
import { FiMenu, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar glass">
      <div className="navbar-left">
        <button
          className="menu-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Buka menu"
        >
          <FiMenu />
        </button>
      </div>

      <div className="navbar-right">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title="Ganti tema"
          aria-label="Ganti tema"
        >
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>

        <div className="user-profile">
          <div
            className="user-info"
            style={{ textAlign: 'right' }}
          >
            <h4>User</h4>
            <p>Welcome back</p>
          </div>

          <div className="avatar">
            U
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;