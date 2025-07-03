import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import Footer from '../footer/footer'

export const PrivateLayout = () => {
    return (
        <div className="layout-root">
            {/*Layout*/}
            {/*Cabecera de Navegacion*/}
            <Header />

            {/*contenido Principal*/}
            <section className='layout__content'>
                <Outlet />
            </section>
            <Footer />
            {/*Barra Lateral*/}
            <Sidebar />
        </div>
    )
}
export default PrivateLayout;
