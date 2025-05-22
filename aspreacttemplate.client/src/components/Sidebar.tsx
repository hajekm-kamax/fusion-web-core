
import { useState } from 'react';

interface SidebarProps {
  activeLink: string;
  onNavigate: (path: string) => void;
}

const Sidebar = ({ activeLink, onNavigate }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // This would be replaced with actual auth state
  const [userName, setUserName] = useState('John Doe'); // This would come from auth context

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  const sidebarWidth = collapsed ? 'width: 70px' : 'width: 250px';

  return (
    <div className="d-flex flex-column flex-shrink-0 bg-light border-end" style={{ height: '100vh', transition: 'width 0.3s ease', [sidebarWidth]: true }}>
      <div className="d-flex align-items-center justify-content-between p-3 mb-3">
        {!collapsed && <span className="fs-4">Menu</span>}
        <button 
          className="btn btn-sm" 
          onClick={toggleSidebar} 
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
        </button>
      </div>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <a 
            href="#" 
            className={`nav-link ${activeLink === 'home' ? 'active' : 'text-dark'} d-flex align-items-center`} 
            onClick={(e) => {e.preventDefault(); onNavigate('home');}}
          >
            <i className="bi bi-house-door me-2"></i>
            {!collapsed && <span>Home</span>}
          </a>
        </li>
        <li className="nav-item">
          <a 
            href="#" 
            className={`nav-link ${activeLink === 'test' ? 'active' : 'text-dark'} d-flex align-items-center`} 
            onClick={(e) => {e.preventDefault(); onNavigate('test');}}
          >
            <i className="bi bi-speedometer2 me-2"></i>
            {!collapsed && <span>Test Page</span>}
          </a>
        </li>
      </ul>

      <div className="border-top mt-auto p-3">
        {loggedIn ? (
          <div className={`d-flex ${collapsed ? 'justify-content-center' : 'justify-content-between'} align-items-center`}>
            {!collapsed && <span>{userName}</span>}
            <button 
              className="btn btn-sm btn-outline-secondary" 
              onClick={handleLogout}
              aria-label="Logout"
            >
              <i className="bi bi-box-arrow-right"></i>
              {!collapsed && <span className="ms-1">Logout</span>}
            </button>
          </div>
        ) : (
          <div className={`d-flex ${collapsed ? 'justify-content-center' : ''}`}>
            <button 
              className="btn btn-sm btn-primary d-flex align-items-center" 
              onClick={handleLogin}
              aria-label="Login"
            >
              <i className="bi bi-box-arrow-in-right"></i>
              {!collapsed && <span className="ms-1">Login</span>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
