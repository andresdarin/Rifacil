import React, { useEffect } from 'react'
import { RifasAsignadas } from './RifasAsignadas';
import { Clientes } from './Clientes';

export const Profile = () => {

    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);
    return (
        <div>
            <div className="container-banner__vendedor">
                <header className='header__vendedor'>Vendedor</header>
            </div>
            <RifasAsignadas />
            <Clientes />
        </div>
    )
}
