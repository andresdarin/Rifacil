import React, { useEffect, useState } from 'react';
import { Global } from '../../../../../helpers/Global';

export const TotalRifasVendidas = () => {
    const [rifasVendidas, setRifasVendidas] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchEstadisticas = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(Global.url + "compra/getEstadisticas", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                });

                if (!response.ok) {
                    throw new Error(`${response.status}`);
                }

                const data = await response.json();
                setRifasVendidas(data.estadisticas.rifasVendidas);
            } catch (error) {
                console.error("Error al obtener estadísticas:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEstadisticas();
    }, []);

    if (loading) return <p>Cargando...</p>;

    // Función para animar el número (contador)
    const animateCount = (value) => {
        if (value === null) return '0';
        return value.toLocaleString();
    };

    return (
        <div className="rifas-container">
            <div className="rifas-icon">
                <span role="img" aria-label="ticket">🎟️</span>
            </div>
            <h2 className="rifas-title">Total de Rifas Vendidas</h2>
            <p className="rifas-number">{animateCount(rifasVendidas)}</p>
        </div>
    );
};
