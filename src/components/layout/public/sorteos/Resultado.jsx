import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global';

export const Resultado = () => {
    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        return () => { document.body.style.backgroundImage = ''; };
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
                        Authorization: token,
                    },
                });
                if (!response.ok) {
                    throw new Error(`Error al obtener sorteos: ${response.statusText}`);
                }
                const data = await response.json();
                if (Array.isArray(data.sorteos) && data.sorteos.length > 0) {
                    // Ordenar por fechaSorteo descendente
                    const sorted = data.sorteos
                        .map(s => ({ ...s, fechaParsed: new Date(s.fechaSorteo) }))
                        .sort((a, b) => b.fechaParsed - a.fechaParsed);
                    const now = new Date();
                    // Tomar el sorteo más reciente que ya haya ocurrido
                    const reciente = sorted.find(s => s.fechaParsed <= now) || sorted[0];
                    setSorteo(reciente);
                } else {
                    setError('No hay sorteos disponibles.');
                }
            } catch (err) {
                setError(err.message);
            }
        };
        obtenerSorteo();
    }, [token]);



    return (
        <div className="resultado_container">
            {sorteo && !error && (
                <header className="header__resultado">Ganadores</header>
            )}

            {!sorteo ? (
                <h1 className='no-sorteos'>No se encontraron sorteos</h1>
            ) : error ? (
                <div>Error: {error}</div>
            ) : (!sorteo.ganadores || sorteo.ganadores.length === 0) ? (
                <h1 className="no-ganadores">No hay ganadores para mostrar.</h1>
            ) : (
                <div className="card_res-container">
                    {/* Primer ganador */}
                    <div className="card_res first-winner">
                        <h1 className='emoji-troph'>🏆</h1>
                        <h1>Primer Premio</h1>
                        <h2>{sorteo.ganadores[0]?.numeroRifa}</h2>
                        <p>{sorteo.ganadores[0]?.nombreParticipante || 'Desconocido'}</p>
                        <p>{sorteo.ganadores[0]?.premio.nombre}</p>
                        <p>{sorteo.ganadores[0]?.premio.descripcion}</p>
                    </div>
                    {/* Segundo ganador */}
                    <div className="card_res second-winner">
                        <h1>🥈</h1>
                        <h1>Segundo Premio</h1>
                        <h2>{sorteo.ganadores[1]?.numeroRifa}</h2>
                        <p>{sorteo.ganadores[1]?.nombreParticipante || 'Desconocido'}</p>
                        <p>{sorteo.ganadores[1]?.premio.nombre}</p>
                        <p>{sorteo.ganadores[1]?.premio.descripcion}</p>
                    </div>
                    {/* Tercer ganador */}
                    <div className="card_res second-winner">
                        <h1>🥉</h1>
                        <h1>Tercer Premio</h1>
                        <h2>{sorteo.ganadores[2]?.numeroRifa}</h2>
                        <p>{sorteo.ganadores[2]?.nombreParticipante || 'Desconocido'}</p>
                        <p>{sorteo.ganadores[2]?.premio.nombre}</p>
                        <p>{sorteo.ganadores[2]?.premio.descripcion}</p>
                    </div>
                    {/* Restantes */}
                    {sorteo.ganadores.slice(3).map((ganador, idx) => (
                        <div className="card_res remaining-winner" key={idx}>
                            <h1>Ganador {idx + 4}</h1>
                            <h2>{ganador.numeroRifa}</h2>
                            <p>{ganador.nombreParticipante || 'Desconocido'}</p>
                            <p>{ganador.premio.nombre}</p>
                            <p>{ganador.premio.descripcion}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );



};

export default Resultado;
