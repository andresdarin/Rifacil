import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import Footer from '../footer/Footer'

export const PrivateLayout = () => {
    return (
        <div className="layout-root">
            {/*Layout*/}
            {/*Cabecera de Navegacion*/}
            <Header />

            {/*contenido Principal*/}
            <section className='layout__content'>
                <Outlet /> {/* ← acá se renderiza la ruta hija de la configuración de react-router */}
            </section>
            <Footer />
        </div>
    )
}
export default PrivateLayout;
