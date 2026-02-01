import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Components/Context/useUser';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";

createRoot(document.getElementById('root')).render(
  <PrimeReactProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </PrimeReactProvider>,
)
