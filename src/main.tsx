import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import Navbar from './components/Navbar'
// import Footer from './components/Footer'
import Landing from './pages/Landing'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
<Landing />
  </StrictMode>,
)
