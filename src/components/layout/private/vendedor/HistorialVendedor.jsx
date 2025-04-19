import React, { useEffect, useState } from 'react'

import { Global } from '../../../../helpers/Global';


export const HistorialVendedor = () => {

    // Manejar el fondo de pantalla
    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);
    return (
        <div className="container-banner__vendedor">
            <header className='header__vendedor'>Historial de Ventas</header>
        </div>

    )
}
