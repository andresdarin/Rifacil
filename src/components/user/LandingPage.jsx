import React from 'react';


export const LandingPage = () => {
    return (
        <>
            <div className="container-banner" id="banner">
                <div>
                    <span className='year__landing'>20</span>
                    <span className='year__landing year__landing-2'>24</span>
                    <header className='header__landing'>Rifácil</header>
                </div>
                <p className='subtitle__landing'>Embárcate hacia la fortuna!</p>
            </div>

            <div className="columns">
                <div className="column column1">

                </div>
                <div className="column column2">
                    <h3 className='article_subtitle'>Primer Premio</h3>
                    <h1 className='article_title'>APARTAMENTO</h1>
                    <h2 className='article_under-title'>Edificio SPAZIO IV, padrón 30511/404, calle Gabriel Pereira No. 3125</h2>
                    <span className='article_paragraph'>
                        Un apartamento moderno y luminoso con vistas panorámicas, ubicado en el corazón de la ciudad. Diseño contemporáneo, cocina equipada, y espacios amplios para disfrutar del confort urbano en cada rincón.
                    </span>
                </div>
            </div>
            <div className="columns">
                <div className="column column3">
                    <h3 className='article_subtitle'>Segundo Premio</h3>
                    <h1 className='article_title'>CAMIONETA</h1>
                    <h2 className='article_under-title'>HYUNDAI Modelo Creta Safe Automática</h2>
                    <span className='article_paragraph'>
                        Un SUV moderno y seguro, con transmisión automática y tecnología avanzada, ideal para quienes buscan confort y confiabilidad en cada viaje.
                    </span>
                </div>
                <div className="column column4"></div>
            </div>
            <div className="columns">
                <div className="column column5"></div>
                <div className="column column6">
                    <h3 className='article_subtitle'>Tercer Premio</h3>
                    <h1 className='article_title'>Crucero a Grecia</h1>
                    <h2 className='article_under-title'>All inclusive en Gregia</h2>
                    <span className='article_paragraph'>
                        Disfruta de un viaje todo incluido a Grecia, con 8 noches que incluyen un emocionante crucero. Explora islas fascinantes y sumérgete en la cultura griega con comodidad absoluta.
                    </span>
                </div>
            </div>
        </>
    );
}
