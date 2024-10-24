import './index.css'
import Router from './Routes/Routes.jsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')).render(
<StrictMode>
    <Router />
    </StrictMode>,
);
