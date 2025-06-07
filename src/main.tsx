import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RoutesApp from './routes/RoutesApp'
import { Provider } from 'react-redux'
import { store } from './hooks/redux/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RoutesApp/>
    </Provider>
  </StrictMode>,
)