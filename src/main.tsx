import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './context/AppContext.tsx'
import { SessionProvider } from './context/SessionContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <SessionProvider>
        <App />
      </SessionProvider>
    </AppProvider>
  </StrictMode>,
)
