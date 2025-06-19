import { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext'; // Adjust path if needed

interface SidebarProps {
    activeLink: string;
    onNavigate: (path: string) => void;
}

const Sidebar = ({ activeLink, onNavigate }: SidebarProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const [showLabel, setShowLabel] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userName] = useState('mdo');

    const { theme, toggleTheme } = useTheme();

    const toggleSidebar = () => setCollapsed(!collapsed);
    const handleLogin = () => setLoggedIn(true);
    const handleLogout = () => setLoggedIn(false);

    useEffect(() => {
        if (!collapsed) {
            const timeout = setTimeout(() => setShowLabel(true), 200);
            return () => clearTimeout(timeout);
        } else {
            setShowLabel(false);
        }
    }, [collapsed]);

    return (
        <div
            className="d-flex flex-column text-white shadow-lg"
            style={{
                backgroundColor: 'var(--sidebar-bg)',
                color: 'var(--sidebar-text)',
                transition: 'width 0.3s ease',
                width: collapsed ? '70px' : '250px',
                height: '100vh',
                position: 'relative'
            }}

        >
            {/* Top brand/logo */}
            <div
                className="border-bottom border-secondary p-3 d-flex align-items-center justify-content-center"
                style={{ height: '58px' }}
            >
                <span className="fs-5 fw-semibold d-flex align-items-center text-white">
                    <i className="bi bi-bootstrap"></i>
                    {showLabel && <span className="ms-2 text-nowrap">Sidebar</span>}
                </span>
            </div>

            {/* Navigation links */}
            <ul className="nav nav-pills flex-column flex-grow-1 px-2 gap-1 mt-3">
                {[
                    { key: 'home', icon: 'house-door', label: 'Homeá' },
                    { key: 'dashboard', icon: 'speedometer2', label: 'Dashboard' },
                    { key: 'orders', icon: 'cart', label: 'Orders' },
                    { key: 'products', icon: 'grid', label: 'Products' },
                    { key: 'test', icon: 'people', label: 'Customers' },
                ].map(({ key, icon, label }) => {
                    const isActive = activeLink === key;

                    const itemStyle: React.CSSProperties = {
                        backgroundColor: isActive ? '#1EAEDB' : 'transparent',
                        borderLeft: isActive ? '4px solid #ffffff' : '4px solid transparent',
                        borderRadius: '0.375rem',
                        transition: 'all 0.2s ease'
                    };

                    return (
                        <li className="nav-item" key={key}>
                            <a
                                href="#"
                                className={`nav-link d-flex align-items-center py-2 px-3 ${isActive ? 'text-white fw-semibold' : 'text-white-50'}`}
                                onClick={(e) => { e.preventDefault(); onNavigate(key); }}
                                style={itemStyle}
                            >
                                <div className={`d-flex ${collapsed ? 'mx-auto' : 'me-3'}`}>
                                    <i className={`bi bi-${icon} fs-5`}></i>
                                </div>
                                {!collapsed && showLabel && (
                                    <span className="text-nowrap overflow-hidden text-truncate">{label}</span>
                                )}
                            </a>
                        </li>
                    );
                })}
            </ul>

            {/* User section */}
            <div className="border-top border-secondary p-3">
                {loggedIn ? (
                    <div className={`d-flex ${collapsed ? 'justify-content-center' : 'justify-content-between'} align-items-center`}>
                        {!collapsed && <span className="text-white-50">{userName}</span>}
                        <button
                            className="btn btn-sm text-white"
                            onClick={handleLogout}
                            aria-label="Logout"
                        >
                            <i className="bi bi-box-arrow-right"></i>
                        </button>
                    </div>
                ) : (
                    <div className="d-flex justify-content-center">
                        <button
                            className="btn btn-sm btn-outline-light d-flex align-items-center"
                            onClick={handleLogin}
                            aria-label="Login"
                        >
                            <i className={`bi bi-box-arrow-in-right ${!collapsed && 'me-2'}`}></i>
                            {!collapsed && <span>Login</span>}
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom: Theme toggle + Collapse button */}
            <div className="border-top border-secondary p-3 d-flex justify-content-between align-items-center">
                {!collapsed && (
                    <button
                        className="btn btn-sm text-white d-flex align-items-center"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        <i className={`bi ${theme === 'dark' ? 'bi-brightness-high' : 'bi-moon'}`}></i>
                        <span className="ms-2">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                    </button>
                )}

                <button
                    className="btn btn-sm text-white"
                    onClick={toggleSidebar}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
