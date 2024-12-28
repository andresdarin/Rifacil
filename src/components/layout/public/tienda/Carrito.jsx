import React, { useEffect } from 'react'

export const Carrito = () => {
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
            <div className="container-banner__productos">
                <header className="header__productos">Carrito de Compras</header>
            </div>
        </div>
    )
}
