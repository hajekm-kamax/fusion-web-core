import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';

function App() {
    const [currentPage, setCurrentPage] = useState<string>('home');

    const handleNavigate = (page: string) => {
        setCurrentPage(page);
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
            <Sidebar activeLink={currentPage} onNavigate={handleNavigate} />
            <div className="content-area flex-grow-1 overflow-auto">
                {renderPage()}
            </div>
        </div>
    );
}

export default App;
