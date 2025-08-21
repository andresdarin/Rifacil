import React, { useEffect, useState } from 'react';
import { Global } from '../../../../../helpers/Global';

export const TotalProductosVendidos = () => {
    const [productosVendidos, setProductosVendidos] = useState(null);
    const [loading, setLoading] = useState(true);

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
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                setProductosVendidos(data.estadisticas.productosVendidos);
            } catch (error) {
                console.error("Error al obtener estadísticas:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEstadisticas();
    }, []);

    if (loading) return <p>Cargando...</p>;

    return (
        <div>
            <h2>Total de productos vendidos</h2>
            <p>{productosVendidos}</p>
        </div>
    );
};
