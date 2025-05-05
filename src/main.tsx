import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RoutesApp from './routes/RoutesApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RoutesApp/>
  </StrictMode>,
)
