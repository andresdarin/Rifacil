import React, { useEffect } from 'react'
import { TotalRifasVendidas } from './Estadisticas/TotalRifasVendidas';
import { IngresosTotales } from './Estadisticas/IngresosTotales';
import { TopProductos } from './Estadisticas/TopProductos';
import { useParams } from 'react-router-dom';
import MetaProgreso from './Profile/MetaProgreso';


export const Estadisticas = () => {
    const { id } = useParams();

    // Manejar el fondo de pantalla
    useEffect(() => {
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);
    return (


        <div className="estadisticas">
            <div className="container-banner__productos">
                <header className='header__vendedor header__estadisticas'>Estadísticas</header>
            </div>

            <section className="estadisticas__resumen">
                <div className="estadisticas-ventas">
                    <div className="estadisticas-metas">
                        <MetaProgreso userId={id} año={2025} />
                    </div>
                    <div>
                        <TotalRifasVendidas />
                    </div>
                    <div>
                        <IngresosTotales />
                    </div>
                </div>
                <div className="estadisticas-grafica">
                    <div className='tendencias-profile-vendedor'>
                        <TopProductos />
                    </div>
                </div>
            </section>
        </div>


    )
}
