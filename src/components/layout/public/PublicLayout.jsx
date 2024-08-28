import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';

export const PublicLayout = () => {
    const location = useLocation();

    // Define las rutas donde el Header no debería mostrarse
    const hideHeaderPaths = ['/login', '/registro'];

    // Verifica si la ruta actual está en la lista de rutas donde el Header debería ocultarse
    const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

    return (
        <>
            {/* Renderiza el Header solo si no estás en una ruta donde debería ocultarse */}
            {!shouldHideHeader && <Header />}

            {/* Contenido Principal */}
            <section className='layout__content'>
                <Outlet />
            </section>
        </>
    );
};

export default PublicLayout;
