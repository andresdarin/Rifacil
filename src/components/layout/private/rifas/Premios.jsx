import React, { useEffect } from 'react'
import ListadoPremios from './ListadoPremios';
import AgregarPremio from './AgregarPremio';

export const Premios = () => {
    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);
    return (
        <div className="premios-container">
            <div className="container-banner__vendedor">
                <header className='header__vendedor'>Premios</header>
            </div>
            <AgregarPremio />
            <ListadoPremios />
        </div>

    )
}
