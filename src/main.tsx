import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import './morador.css'
import './acessivel.css'
import { aplicarLetras, lerLetras } from './letras'

aplicarLetras(lerLetras())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
