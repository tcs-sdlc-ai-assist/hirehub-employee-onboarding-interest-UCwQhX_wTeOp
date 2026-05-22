import { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { isAdminAuthenticated, logoutAdmin } from '../utils/auth';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated());
  }, [location]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleToggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    logoutAdmin();
    setAuthenticated(false);
    navigate('/');
  }, [navigate]);

  const handleLogin = useCallback(() => {
    navigate('/admin');
  }, [navigate]);

  return (
    <header className="header">
      <div className="header-container">
        <NavLink to="/" className="header-logo">
          HireHub
        </NavLink>

        <button
          className="header-menu-toggle"
          onClick={handleToggleMenu}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`header-nav${menuOpen ? ' nav-open' : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `header-nav-link${isActive ? ' active' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/apply"
            className={({ isActive }) =>
              `header-nav-link${isActive ? ' active' : ''}`
            }
          >
            Apply
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `header-nav-link${isActive ? ' active' : ''}`
            }
          >
            Admin
          </NavLink>

          {authenticated ? (
            <button
              className="header-btn header-btn-logout"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          ) : (
            <button
              className="header-btn header-btn-primary"
              onClick={handleLogin}
              type="button"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;