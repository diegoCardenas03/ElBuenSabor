import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react'
import RoutesApp from './routes/RoutesApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-3fzxbv6nav846rjb.us.auth0.com"
      clientId="m4etkhGCglGOmn32GHG3QPxSy4TKtMxJ"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <RoutesApp />
    </Auth0Provider>
  </StrictMode>
)
