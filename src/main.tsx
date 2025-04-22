import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import { MenuPage } from './pages/MenuPage.tsx'
// import Landing from './pages/Landing.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MenuPage />
  </StrictMode>,
)
