import React, { useEffect } from 'react'

export const Sortear = () => {
    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);
    return (
        <div className='sorteo-container'>
            <div className="container-banner__vendedor">
                <header className="header__vendedor">Sortear</header>
            </div>
        </div>
    )
}
