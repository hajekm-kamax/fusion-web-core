
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { SidebarProvider } from './contexts/SidebarContext.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
    // <StrictMode>
        <ThemeProvider>
            <SidebarProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </SidebarProvider>
        </ThemeProvider>
   // </StrictMode>,
);
