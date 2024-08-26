import React from 'react';

export const LandingPage = () => {
    return (
        <>
            <div className="container-banner" id="banner">
                <p>20</p>
                <p>24</p>
                <header><h1>Rifácil</h1></header>
                <p>Donde tus sueños se hacen realidad</p>
            </div>

            <div className="columns">
                <div className="column column1">

                </div>
                <div className="column column2">
                    <h3>Primer Premio</h3>
                    <h1>APARTAMENTO</h1>
                    <h2>Edificio SPAZIO IV, padrón 30511/404, calle Gabriel Pereira No. 3125</h2>
                    <p>
                        Un apartamento moderno y luminoso con vistas panorámicas, ubicado en el corazón de la ciudad. Diseño contemporáneo, cocina equipada, y espacios amplios para disfrutar del confort urbano en cada rincón.
                    </p>
                </div>
            </div>
            <div className="columns">
                <div className="column column3">Contenido columna 3</div>
                <div className="column column4"></div>
            </div>
            <div className="columns">
                <div className="column column5"></div>
                <div className="column column6">Contenido columna 6</div>
            </div>
        </>
    );
}
