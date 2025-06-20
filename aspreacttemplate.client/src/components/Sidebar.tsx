import { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useSidebar } from '../contexts/SidebarContext';
import { useAuth } from '../contexts/AuthContext';
import { login, logout } from '../api/auth';

interface SidebarProps {
    activeLink: string;
    onNavigate: (path: string) => void;
}

const Sidebar = ({ activeLink, onNavigate }: SidebarProps) => {
    const { collapsed, toggleSidebar } = useSidebar();
    const { theme, toggleTheme } = useTheme();
    const { user, loading } = useAuth();
    const [showLabel, setShowLabel] = useState(true);

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
            className="d-flex flex-column shadow-lg"
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
                className="d-flex align-items-center border-bottom p-3"
                style={{
                    borderColor: 'var(--sidebar-divider-color)',
                    height: '58px'
                }}
            >
                <div className={`d-flex align-items-center ${collapsed ? 'mx-auto' : ''}`}>
                    <i className="bi bi-bootstrap fs-4" style={{ color: 'var(--sidebar-text)' }}></i>
                    {showLabel && !collapsed && (
                        <span className="ms-2 fs-5 fw-semibold text-nowrap" style={{ color: 'var(--sidebar-text)' }}>Sidebar</span>
                    )}
                </div>
            </div>

            {/* Navigation links */}
            <ul className="nav nav-pills flex-column flex-grow-1 px-2 gap-1 mt-3">
                {[
                    { key: 'home', icon: 'house-door', label: 'Home' },
                    { key: 'test', icon: 'grid', label: 'Test' },
                    { key: 'admin', icon: 'person', label: 'Adminův koutek' }, 
                    { key: 'weatherforecastpage', icon: 'cloud', label: 'Weather forecast'}
                ].map(({ key, icon, label }) => {
                    const isActive = activeLink === key;

                    const itemStyle: React.CSSProperties = {
                        backgroundColor: isActive ? 'var(--highlight-bg)' : 'transparent',
                        borderLeft: isActive ? '4px solid var(--sidebar-text)' : '4px solid transparent',
                        borderRadius: '0.375rem',
                        transition: 'all 0.2s ease',
                        color: isActive ? 'var(--sidebar-text)' : 'var(--sidebar-muted)'
                    };

                    return (
                        <li className="nav-item" key={key}>
                            <a
                                href="#"
                                className="nav-link d-flex align-items-center py-2 px-3"
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
            <div
                className="border-top p-3"
                style={{
                    borderColor: 'var(--sidebar-divider-color)',
                    borderTopStyle: 'solid',
                    borderTopWidth: '1px'
                }}
            >
                {loading ? (
                    <div style={{ color: 'var(--sidebar-muted)' }} className="text-center">Checking login...</div>
                ) : user ? (
                    <div className={`d-flex ${collapsed ? 'justify-content-center' : 'justify-content-between'} align-items-center`}>
                        {!collapsed && showLabel && (
                            <span style={{ color: 'var(--sidebar-text)' }}>{user.name}</span>
                        )}
                        <button
                            className="btn btn-sm"
                            style={{ color: 'var(--sidebar-text)' }}
                            onClick={logout}
                            aria-label="Logout"
                        >
                            <i className="bi bi-box-arrow-right"></i>
                        </button>
                    </div>
                ) : (
                    <div className="d-flex justify-content-center">
                        <button
                            className="btn btn-sm btn-outline-light d-flex align-items-center"
                            onClick={login}
                            aria-label="Login"
                        >
                            <i className={`bi bi-box-arrow-in-right ${!collapsed && showLabel ? 'me-2' : ''}`}></i>
                            {!collapsed && showLabel && <span>Login</span>}
                        </button>
                    </div>
                )}
            </div>


            {/* Bottom: Theme toggle + Collapse button */}
            <div
                className="border-top p-3 d-flex align-items-center justify-content-between"
                style={{
                    borderColor: 'var(--sidebar-divider-color)',
                    borderTopStyle: 'solid',
                    borderTopWidth: '1px'
                }}
            >
                {!collapsed && (
                    <button
                        className="btn btn-sm d-flex align-items-center"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        style={{ color: 'var(--sidebar-text)' }}
                    >
                        <i className={`bi ${theme === 'dark' ? 'bi-brightness-high' : 'bi-moon'}`}></i>
                        <span className="ms-2">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                    </button>
                )}
                <button
                    className="btn btn-sm"
                    onClick={toggleSidebar}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    style={{ color: 'var(--sidebar-text)' }}
                >
                    <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
