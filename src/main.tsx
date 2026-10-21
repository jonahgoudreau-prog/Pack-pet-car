import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { startServiceWorker } from './pwa/registerServiceWorker'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/global.css'

startServiceWorker()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
