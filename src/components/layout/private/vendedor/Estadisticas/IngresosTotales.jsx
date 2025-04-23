import React, { useEffect, useState } from 'react';
import { Global } from '../../../../../helpers/Global';

export const IngresosTotales = () => {
    const [ingresosTotales, setIngresosTotales] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const obtenerIngresos = async () => {
            try {
                const response = await fetch(Global.url + 'compra/obtenerIngresosTotalesPorUsuario', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                setIngresosTotales(data.ingresosTotales);
            } catch (err) {
                console.error('Error al obtener los ingresos totales:', err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        obtenerIngresos();
    }, [token]);

    if (loading) return <p>Cargando ingresos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="ingresos-container">
            <div className="ingresos-icon">
                <span role="img" aria-label="money-bag">💰</span>
            </div>
            <h2 className="ingresos-title">Ingresos Totales por Rifas</h2>
            <p className="ingresos-amount">${ingresosTotales?.toLocaleString()}</p>
        </div>
    );
};
