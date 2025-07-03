import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import Footer from '../footer/footer';

export const PublicLayout = () => {
    const location = useLocation();

    // Define las rutas donde el Header no debería mostrarse
    const hideHeaderPaths = ['/', '/login', '/registro', '/recover-pass'];

    // Verifica si la ruta actual es '/reset-password/' seguido de cualquier token
    const isResetPasswordPath = location.pathname.startsWith('/reset-password/');

    // Verifica si la ruta actual está en la lista de rutas donde el Header debería ocultarse
    const shouldHideHeader = hideHeaderPaths.includes(location.pathname) || isResetPasswordPath;

    return (
        <>
            {/* Renderiza el Header solo si no estás en una ruta donde debería ocultarse */}
            {!shouldHideHeader && <Header />}

            {/* Contenido Principal */}
            <section className='layout__content'>
                <Outlet />
            </section>
            <Footer />
        </>
    );
};

export default PublicLayout;
