import { useState } from 'react'
import { Rutas } from './routes/Rutas'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <div className="layout">
        <Rutas />
        <ToastContainer />
      </div>
    </>
  )
}

export default App
