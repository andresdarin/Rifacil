import React, { useEffect, useState } from 'react';
import { Global } from '../../../../../helpers/Global';

export const IngresosTotales = () => {
    const [ingresosTotales, setIngresosTotales] = useState(null);
    const [loading, setLoading] = useState(true);
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
                    setIngresosTotales(0); // Si hay error HTTP, asumimos ingresos cero
                    return;
                }

                const data = await response.json();
                setIngresosTotales(data.ingresosTotales);
            } catch (err) {
                console.error('Error al obtener los ingresos totales:', err.message);
                setIngresosTotales(0); // También en errores de red
            } finally {
                setLoading(false);
            }
        };

        obtenerIngresos();
    }, [token]);

    if (loading) return <p>Cargando ingresos...</p>;

    return (
        <div className="ingresos-container">
            <div className="ingresos-icon">
                <span role="img" aria-label="money-bag">💰</span>
            </div>
            <h2 className="ingresos-title">Ingresos Totales por Rifas</h2>
            {
                ingresosTotales === 0
                    ? <p className="ingresos-amount-none">Aún no hay ingresos registrados.</p>
                    : <p className="ingresos-amount">${ingresosTotales?.toLocaleString()}</p>
            }
        </div>
    );
};
