import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global';

export const Resultado = () => {
    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/clover_bg.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    const [sorteo, setSorteo] = useState(null);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const obtenerSorteo = async () => {
            try {
                const response = await fetch(Global.url + 'sorteo/listarGanadores', {

                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token

                    }
                });
                if (!response.ok) {
                    throw new Error(`Error al obtener el sorteo: ${response.statusText}`);
                }
                const data = await response.json();
                if (data.sorteos && data.sorteos.length > 0) {
                    setSorteo(data.sorteos[0]); // Usar el primer sorteo disponible
                } else {
                    setError('No hay sorteos disponibles.');
                }
            } catch (error) {
                setError(error.message);
            }
        };

        obtenerSorteo();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!sorteo) {
        return <div>Cargando datos del sorteo...</div>;
    }

    return (
        <div className="resultado_container">
            <header className="header__resultado">Ganadores</header>
            <div className="card_res-container">
                {/* Primer ganador - ocupa 3 columnas */}
                <div className="card_res first-winner">
                    <h2>Primer Premio</h2>
                    <h1>{sorteo.ganadores[0]?.numeroRifa}</h1>
                    <p>{sorteo.ganadores[0]?.nombreParticipante || 'Desconocido'}</p>
                    <p>{sorteo.ganadores[0]?.premio.nombre}</p>
                    <p>{sorteo.ganadores[0]?.premio.descripcion}</p>
                </div>

                {/* Segundo ganador - ocupa 2 columnas */}
                <div className="card_res second-winner">
                    <h2>Segundo Premio</h2>
                    <h2>{sorteo.ganadores[1]?.numeroRifa}</h2>
                    <p>{sorteo.ganadores[1]?.nombreParticipante || 'Desconocido'}</p>
                    <p>{sorteo.ganadores[1]?.premio.nombre}</p>
                    <p>{sorteo.ganadores[1]?.premio.descripcion}</p>
                </div>

                {/* Tercer ganador - ocupa 2 columnas */}
                <div className="card_res second-winner">
                    <h2>Tercer Premio</h2>
                    <h2>{sorteo.ganadores[2]?.numeroRifa}</h2>
                    <p>{sorteo.ganadores[2]?.nombreParticipante || 'Desconocido'}</p>
                    <p>{sorteo.ganadores[2]?.premio.nombre}</p>
                    <p>{sorteo.ganadores[2]?.premio.descripcion}</p>
                </div>

                {/* Otros ganadores - ocupa 1 columna cada uno */}
                <div className="remaining-winners">
                    {sorteo.ganadores.slice(3).map((ganador, index) => (
                        <div className="card_res" key={index}>
                            <h2>Ganador {index + 4}</h2>
                            <h2>{ganador.numeroRifa}</h2>
                            <p>{ganador.nombreParticipante || 'Desconocido'}</p>
                            <p>{ganador.premio.nombre}</p>
                            <p>{ganador.premio.descripcion}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>


    );
};
