import React, { useState, useEffect } from 'react';
import { Global } from '../../../helpers/Global';

export const ListadoSorteos = () => {
    const [proximoSorteo, setProximoSorteo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProximoSorteo = async () => {
            try {
                const response = await fetch(`${Global.url}sorteo/sorteosFuturos`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error("No se pudo obtener el próximo sorteo");
                }

                const data = await response.json();
                const sorteos = data.sorteos;

                // Verifica si hay sorteos futuros disponibles
                if (sorteos && sorteos.length > 0) {
                    setProximoSorteo(sorteos[0]); // Toma el primer sorteo futuro
                } else {
                    setError("No hay sorteos futuros disponibles.");
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchProximoSorteo();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!proximoSorteo) {
        return <div>Cargando...</div>;
    }

    return (
        <div className='PS_all'>
            <div className="container-banner__prox">
                <header className="header__prox">Próximo Sorteo</header>
                <h2 className='article_subtitle'>
                    {new Date(proximoSorteo.fechaSorteo).toLocaleDateString()}
                </h2>
            </div>
            <div className="sorteo__container">
                <div className="premios-list">
                    <h3>Premios</h3>
                    <ul>
                        {proximoSorteo.premios.map((premio, index) => (
                            <li key={premio.id}>
                                <strong>{`${index + 1}º Premio: ${premio.nombre}`}</strong>
                                {/* Muestra la descripción si existe */}
                                <p className="premio-descripcion">
                                    {premio.descripcion || "Sin descripción disponible"}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
