import React, { useEffect } from 'react'

export const Rifas = () => {
    useEffect(() => {
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);
    return (
        <div className="container-banner__productos">
            <header className='header__vendedor'>Rifas</header>
        </div>
    )
}
