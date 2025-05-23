
import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';

function App() {
    const [currentPage, setCurrentPage] = useState<string>('home');
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

    const handleNavigate = (page: string) => {
        setCurrentPage(page);
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    // Render the appropriate page based on navigation state
    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage />;
            case 'test':
                return <TestPage />;
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="d-flex">
            <Sidebar 
                activeLink={currentPage} 
                onNavigate={handleNavigate} 
                isCollapsed={sidebarCollapsed} 
                onToggleCollapse={toggleSidebar}
            />
            <div className="content-area flex-grow-1 overflow-auto">
                {renderPage()}
            </div>
        </div>
    );
}

export default App;
