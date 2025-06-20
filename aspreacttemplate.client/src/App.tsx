import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';

function Layout() {
    const location = useLocation();
    const navigate = useNavigate();

    const currentPath = location.pathname.replace('/', '') || 'home';

    const handleNavigate = (path: string) => {
        navigate(`/${path}`);
    };

    return (
        <div className="d-flex">
            <Sidebar activeLink={currentPath} onNavigate={handleNavigate} />
            <div className="content-area flex-grow-1 overflow-auto">
                <Routes>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/test" element={<TestPage />} />
                    <Route path="*" element={<HomePage />} />
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Layout />
        </Router>
    );
}

export default App;
