import { createRoot } from 'react-dom/client'
import App from '@/App.tsx'
import '@/index.css'
import { BrowserRouter } from 'react-router-dom'
// import without explicit extension so Vite resolves JSX/TSX correctly
import { AppProvider } from '@/context/AppContext'

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <AppProvider>
            <App />
        </AppProvider>
    </BrowserRouter>
)

