import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { api } from "../api";

/* ────────────────────────────────────────────────────────── *
 * Props are identical to the original component:            *
 *   • activeLink  – “home” | “test” …                       *
 *   • onNavigate  – callback to change the current page     *
 * ────────────────────────────────────────────────────────── */
interface SidebarProps {
    activeLink: string;
    onNavigate: (path: string) => void;
}

const Sidebar = ({ activeLink, onNavigate }: SidebarProps) => {
    /* original local-state for collapsing */
    const [collapsed, setCollapsed] = useState(false);

    /* new: auth status from react-oidc-context */
    const { user, isLoading, signinRedirect, signoutRedirect } = useAuth();

    /* username to show when logged in */
    const userName =
        user?.profile?.preferred_username ||
        user?.profile?.name ||
        user?.profile?.email ||
        "user";

    /* ---------------- handlers ---------------- */
    const toggleSidebar = () => setCollapsed(!collapsed);

    const handleLogin = async () => {
        console.log("login clicked");
        signinRedirect()
            .then(mes => {
                console.log(mes)
            })
            .catch(err => {
                console.error("OIDC signinRedirect failed ➜", err);
                alert("Login failed – check console output.");
            });
    };

    const handleLogout = async () => {
        try {
            await api.post("/api/auth/logout");              // revoke cookies / RT
        } finally {
            signoutRedirect();                               // IdP logout
        }
    };

    /* ---------------- UI ---------------- */
    return (
        <div
            className={`d-flex flex-column flex-shrink-0 text-white transition-all ${collapsed ? "sidebar-collapsed" : "sidebar-expanded"
                }`}
            style={{
                backgroundColor: "#1A1F2C",
                transition: "width 0.3s ease",
                width: collapsed ? "70px" : "250px",
                height: "100vh",
            }}
        >
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between p-3 mb-2 border-bottom border-secondary">
                {!collapsed && (
                    <span className="fs-5 fw-semibold text-white">
                        <i className="bi bi-bootstrap me-3" />
                        Template
                    </span>
                )}

                {collapsed && (
                    <span className="fs-5 fw-semibold text-white mx-auto">
                        <img
                            src="./assets/getsitelogo.png"
                            alt="Logo"
                            style={{ width: 24, height: 24 }}
                        />
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

            {/* Navigation */}
            <ul className="nav nav-pills flex-column mb-auto px-0">
                <li className="nav-item">
                    <a
                        href="#"
                        className={`nav-link d-flex align-items-center py-2 px-3 ${activeLink === "home" ? "active" : "text-white"
                            } ${collapsed ? "justify-content-center" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            onNavigate("home");
                        }}
                        style={{
                            backgroundColor: activeLink === "home" ? "#1EAEDB" : "transparent",
                        }}
                    >
                        <i className="bi bi-house-door" />
                        {!collapsed && <span className="ms-3">Domů</span>}
                    </a>
                </li>

                <li className="nav-item">
                    <a
                        href="#"
                        className={`nav-link d-flex align-items-center py-2 px-3 ${activeLink === "test" ? "active" : "text-white"
                            } ${collapsed ? "justify-content-center" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            onNavigate("test");
                        }}
                        style={{
                            backgroundColor: activeLink === "test" ? "#1EAEDB" : "transparent",
                        }}
                    >
                        <i className="bi bi-people" />
                        {!collapsed && <span className="ms-3">Test stránka</span>}
                    </a>
                </li>
            </ul>

            {/* Auth section */}
            {!isLoading && (
                <div className="border-top border-secondary mt-auto">
                    <div
                        className={`d-flex align-items-center p-3 ${collapsed ? "justify-content-center" : "justify-content-between"
                            }`}
                    >
                        {user ? (
                            <>
                                <div className="d-flex align-items-center">
                                    {!collapsed && <span className="text-white">{userName}</span>}
                                </div>

                                {!collapsed ? (
                                    <button
                                        className="btn btn-sm text-white"
                                        onClick={handleLogout}
                                        aria-label="Logout"
                                    >
                                        <i className="bi bi-box-arrow-right" />
                                    </button>
                                ) : (
                                    /* collapsed: show only icon */
                                    <button
                                        className="btn btn-sm text-white"
                                        onClick={handleLogout}
                                        aria-label="Logout"
                                    >
                                        <i className="bi bi-box-arrow-right" />
                                    </button>
                                )}
                            </>
                        ) : (
                            <button
                                className={`btn btn-sm btn-outline-light d-flex align-items-center ${collapsed ? "mx-0" : "mx-auto"
                                    }`}
                                onClick={handleLogin}
                                aria-label="Login"
                            >
                                <i className={`bi bi-box-arrow-in-right ${!collapsed && "me-2"}`} />
                                {!collapsed && <span>Login</span>}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Expand button when collapsed */}
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
