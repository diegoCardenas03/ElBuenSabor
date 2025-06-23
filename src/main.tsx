import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import RoutesApp from './routes/RoutesApp'
import { Provider } from 'react-redux'
import { store } from './hooks/redux/store'
import { BrowserRouter } from 'react-router-dom'
import { Auth0ProviderApp } from './auth/Auth0ProviderApp'
import AppWrapper from './components/AppWrapper'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Auth0ProviderApp>
          <AppWrapper />
        </Auth0ProviderApp>
      </BrowserRouter>
    </Provider>
  </StrictMode>
  
)