import { useEffect, useState } from "react";
import { login, logout } from "../api/auth";

interface SidebarProps {
    activeLink: string;
    onNavigate: (path: string) => void;
}

const Sidebar = ({ activeLink, onNavigate }: SidebarProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);

    // naive presence-of-cookie check + optional /api/me call for display name
    useEffect(() => {
        const hasCookie = document.cookie.split("; ").some(c => c.startsWith("app_access="));
        setIsAuthenticated(hasCookie);

        if (hasCookie) {
            fetch("/api/me", { credentials: "include" })
                .then(r => (r.ok ? r.json() : null))
                .then(d => d && setUserName(d.name))
                .catch(() => {/* ignore */ });
        }
    }, []);

    const toggleSidebar = () => setCollapsed(!collapsed);

    return (
        <div
            className={`d-flex flex-column flex-shrink-0 text-white transition-all ${collapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}
            style={{
                backgroundColor: "#1A1F2C",
                transition: "width 0.3s ease",
                width: collapsed ? "70px" : "250px",
                height: "100vh"
            }}
        >
            {/* header --------------------------------------------------------- */}
            <div className="d-flex align-items-center justify-content-between p-3 mb-2 border-bottom border-secondary">
                {!collapsed ? (
                    <span className="fs-5 fw-semibold text-white">
                        <i className="bi bi-bootstrap me-3" />
                        Template
                    </span>
                ) : (
                    <span className="fs-5 fw-semibold text-white mx-auto">
                        <img src="./assets/getsitelogo.png" alt="Logo" style={{ width: 24, height: 24 }} />
                    </span>
                )}
                {!collapsed && (
                    <button
                        className="btn btn-sm text-white"
                        onClick={toggleSidebar}
                        aria-label="Collapse sidebar"
                    >
                        <i className="bi bi-chevron-left" />
                    </button>
                )}
            </div>

            {/* nav links ------------------------------------------------------ */}
            <ul className="nav nav-pills flex-column mb-auto px-0">
                <li className="nav-item">
                    <a
                        href="#"
                        className={`nav-link d-flex align-items-center py-2 px-3 ${activeLink === "home" ? "active" : "text-white"} ${collapsed ? "justify-content-center" : ""}`}
                        onClick={e => { e.preventDefault(); onNavigate("home"); }}
                        style={{ backgroundColor: activeLink === "home" ? "#1EAEDB" : "transparent" }}
                    >
                        <i className="bi bi-house-door" />
                        {!collapsed && <span className="ms-3">Domů</span>}
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        href="#"
                        className={`nav-link d-flex align-items-center py-2 px-3 ${activeLink === "test" ? "active" : "text-white"} ${collapsed ? "justify-content-center" : ""}`}
                        onClick={e => { e.preventDefault(); onNavigate("test"); }}
                        style={{ backgroundColor: activeLink === "test" ? "#1EAEDB" : "transparent" }}
                    >
                        <i className="bi bi-people" />
                        {!collapsed && <span className="ms-3">Test stránka</span>}
                    </a>
                </li>
            </ul>

            {/* auth section --------------------------------------------------- */}
            <div className="border-top border-secondary mt-auto">
                <div className={`d-flex align-items-center p-3 ${collapsed ? "justify-content-center" : "justify-content-between"}`}>
                    {isAuthenticated ? (
                        <>
                            {!collapsed && <span className="text-white">{userName ?? "User"}</span>}
                            <button
                                className="btn btn-sm text-white"
                                onClick={logout}
                                aria-label="Logout"
                            >
                                <i className="bi bi-box-arrow-right" />
                            </button>
                        </>
                    ) : (
                        <button
                            className="btn btn-sm btn-outline-light d-flex align-items-center mx-auto"
                            onClick={login}
                            aria-label="Login"
                        >
                            <i className={`bi bi-box-arrow-in-right ${!collapsed && "me-2"}`} />
                            {!collapsed && <span>Login</span>}
                        </button>
                    )}
                </div>
            </div>

            {/* expand button when collapsed ---------------------------------- */}
            {collapsed && (
                <div className="text-center mb-3">
                    <button
                        className="btn btn-sm text-white"
                        onClick={toggleSidebar}
                        aria-label="Expand sidebar"
                    >
                        <i className="bi bi-chevron-right" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
