
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './index.css'
import App from './App.tsx'
import { OidcProvider } from './auth/Oidc.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <OidcProvider>
            <App />
        </OidcProvider>
    </StrictMode>,
)
