
import { useState } from 'react';

interface SidebarProps {
    activeLink: string;
    onNavigate: (path: string) => void;
}

const Sidebar = ({ activeLink, onNavigate }: SidebarProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userName] = useState('mdo');

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const handleLogin = () => {
        setLoggedIn(true);
    };

    const handleLogout = () => {
        setLoggedIn(false);
    };

    return (
        <div
            className={`d-flex flex-column flex-shrink-0 text-white transition-all ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
            style={{
                backgroundColor: '#1A1F2C',
                transition: 'width 0.3s ease',
                width: collapsed ? '70px' : '250px',
                height: '100vh'
            }}
        >
            <div className="d-flex align-items-center justify-content-between p-3 mb-2 border-bottom border-secondary">
                {!collapsed && (
                    <span className="fs-5 fw-semibold text-white">
                        <i className="bi bi-bootstrap me-2"></i>
                        Sidebar
                    </span>
                )}
                {collapsed && (
                    <span className="fs-5 fw-semibold text-white mx-auto">
                        <i className="bi bi-bootstrap"></i>
                    </span>
                )}
                {!collapsed && (
                    <button
                        className="btn btn-sm text-white"
                        onClick={toggleSidebar}
                        aria-label="Collapse sidebar"
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                )}
            </div>

            <ul className="nav nav-pills flex-column mb-auto px-0">
                <li className="nav-item">
                    <a
                        href="#"
                        className={`nav-link d-flex align-items-center py-2 px-3 ${activeLink === 'home' ? 'active' : 'text-white'}`}
                        onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
                        style={{ backgroundColor: activeLink === 'home' ? '#1EAEDB' : 'transparent' }}
                    >
                        <i className="bi bi-house-door me-3"></i>
                        {!collapsed && <span>Home</span>}
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        href="#"
                        className={`nav-link d-flex align-items-center py-2 px-3 ${activeLink === 'dashboard' ? 'active' : 'text-white'}`}
                        onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}
                        style={{ backgroundColor: activeLink === 'dashboard' ? '#1EAEDB' : 'transparent' }}
                    >
                        <i className="bi bi-speedometer2 me-3"></i>
                        {!collapsed && <span>Dashboard</span>}
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        href="#"
                        className={`nav-link d-flex align-items-center py-2 px-3 ${activeLink === 'orders' ? 'active' : 'text-white'}`}
                        onClick={(e) => { e.preventDefault(); onNavigate('orders'); }}
                        style={{ backgroundColor: activeLink === 'orders' ? '#1EAEDB' : 'transparent' }}
                    >
                        <i className="bi bi-cart me-3"></i>
                        {!collapsed && <span>Orders</span>}
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        href="#"
                        className={`nav-link d-flex align-items-center py-2 px-3 ${activeLink === 'products' ? 'active' : 'text-white'}`}
                        onClick={(e) => { e.preventDefault(); onNavigate('products'); }}
                        style={{ backgroundColor: activeLink === 'products' ? '#1EAEDB' : 'transparent' }}
                    >
                        <i className="bi bi-grid me-3"></i>
                        {!collapsed && <span>Products</span>}
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        href="#"
                        className={`nav-link d-flex align-items-center py-2 px-3 ${activeLink === 'test' ? 'active' : 'text-white'}`}
                        onClick={(e) => { e.preventDefault(); onNavigate('test'); }}
                        style={{ backgroundColor: activeLink === 'test' ? '#1EAEDB' : 'transparent' }}
                    >
                        <i className="bi bi-people me-3"></i>
                        {!collapsed && <span>Customers</span>}
                    </a>
                </li>
            </ul>

            <div className="border-top border-secondary mt-auto">
                <div className={`d-flex align-items-center p-3 ${collapsed ? 'justify-content-center' : 'justify-content-between'}`}>
                    {loggedIn ? (
                        <>
                            <div className="d-flex align-items-center">
                                {!collapsed && <span className="text-white">{userName}</span>}
                            </div>
                            {!collapsed && (
                                <button
                                    className="btn btn-sm text-white"
                                    onClick={handleLogout}
                                    aria-label="Logout"
                                >
                                    <i className="bi bi-box-arrow-right"></i>
                                </button>
                            )}
                        </>
                    ) : (
                        <button
                            className="btn btn-sm btn-outline-light d-flex align-items-center mx-auto"
                            onClick={handleLogin}
                            aria-label="Login"
                        >
                            <i className={`bi bi-box-arrow-in-right ${!collapsed && 'me-2'}`}></i>
                            {!collapsed && <span>Login</span>}
                        </button>
                    )}
                </div>
            </div>

            {collapsed && (
                <div className="text-center mb-3">
                    <button
                        className="btn btn-sm text-white"
                        onClick={toggleSidebar}
                        aria-label="Expand sidebar"
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sidebar;