import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AuthProvider from './context/AuthProvider.jsx';
import CartProvider from './context/CartProvider.jsx';



//importar assests, recursos como hojas de estilo, imagenes, fuentes, todo
import './assets/fonts/fontawesome-free-6.1.2-web/css/all.css';
import './assets/css/normalize.css'
import './assets/css/styles.css'
import './assets/css/responsive.css'




ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
)
