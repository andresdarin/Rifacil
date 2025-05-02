import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global';

export const Historial = () => {
    const [sorteos, setSorteos] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPrize, setSelectedPrize] = useState(null); // Estado para el premio seleccionado
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const token = localStorage.getItem('token');

    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    useEffect(() => {
        const fetchHistorialSorteos = async () => {
            try {
                const response = await fetch(Global.url + "sorteo/historialSorteo", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });
                if (!response.ok) {
                    throw new Error("Error al obtener el historial de sorteos: " + response.statusText);
                }
                const data = await response.json();
                setSorteos(data.sorteos);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistorialSorteos();
    }, []);

    const handlePrizeClick = (premio) => {
        setSelectedPrize(premio);
    };

    const closeTooltip = () => {
        setSelectedPrize(null);
    };

    if (isLoading) {
        return <div>Cargando historial de sorteos...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="historial-container">
            <div className="container-banner__vendedor">
                <header className="header__vendedor header__admin">Historial</header>
            </div>
            <div className="table-container">
                {sorteos.length === 0 ? (
                    <p>No se encontraron sorteos realizados en el historial.</p>
                ) : (
                    <table className="historial_sorteos-tb">
                        <thead className="historial_sorteos-titles">
                            <tr>
                                <th>Mes</th>
                                <th>Año</th>
                                <th>Se Sorteó</th>
                                <th>Premios y Rifas Ganadoras</th>
                            </tr>
                        </thead>
                        <tbody className='historial_sorteos-body'>
                            {sorteos.map((sorteo, index) => (
                                <tr key={index}>
                                    <td className="historial_sorteos-mes">
                                        {monthNames[sorteo.mes - 1] || 'Mes desconocido'}
                                    </td>
                                    <td className="historial_sorteos-anio">{sorteo.año}</td>
                                    <td className="historial_sorteos-fecha">
                                        {new Date(sorteo.fechaSorteo).toLocaleDateString().replace(/\//g, '.')}
                                    </td>
                                    <td className="nro_premio-list">
                                        {sorteo.premios.map((premio, i) => (
                                            <div
                                                className={`item ${i === 0 ? 'item--destacado' : ''}`}
                                                key={i}
                                                onClick={() => handlePrizeClick(premio)}
                                            >
                                                {i === 0 && <h1 className='emoji-troph_historial'>🏆</h1>}
                                                <h2>{sorteo.rifasGanadoras[i]?.NumeroRifa || 'Sin número'}</h2>
                                                <h4>{premio.nombre}</h4>
                                            </div>
                                        ))}

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {selectedPrize && (
                    <div className="tooltip" onClick={closeTooltip}>
                        <h3>{selectedPrize.nombre}</h3>
                        <p>{selectedPrize.descripcion}</p>
                        <button>Cerrar</button>
                    </div>
                )}
            </div>
        </div>
    );
};
