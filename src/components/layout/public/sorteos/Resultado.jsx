import React, { useEffect, useState } from 'react'
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

    useEffect(() => {
        // Llamada al endpoint para obtener el sorteo realizado
        const obtenerSorteo = async () => {
            try {
                const response = await fetch(Global.url + 'sorteo/listarGanadores');
                if (!response.ok) {
                    throw new Error(`Error al obtener el sorteo: ${response.statusText}`);
                }
                const data = await response.json();
                setSorteo(data.sorteo);
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
            <header className="header__resultado">Ganadores del Sorteo</header>
            <div className="card-container">
                {sorteo.rifasGanadoras.map((ganador, index) => (
                    <div className="login-card" key={index}>
                        <h2>Ganador {index + 1}</h2>
                        <p><strong>Número de Rifa:</strong> {ganador.NumeroRifa}</p>
                        <p><strong>Nombre:</strong> {ganador.nombreParticipante || 'Desconocido'}</p>
                        <p><strong>Premio:</strong> {sorteo.premios[index]?.premio || `Premio ${index + 1}`}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
