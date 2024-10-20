import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, Tooltip, Legend } from 'chart.js';

// Registra los componentes que vas a usar
Chart.register(BarElement, Tooltip, Legend);

const Tendencias = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTendencias = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No se encontró un token de autorización.');
            }

            const response = await fetch(`${Global.url}producto/tendencias`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener las tendencias.');
            }

            const data = await response.json();

            if (data.status === 'success' && Array.isArray(data.products)) {
                setProductos(data.products);
            } else {
                setError('No se pudieron obtener las tendencias.');
            }
        } catch (error) {
            setError(error.message || 'Ocurrió un error al obtener las tendencias.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTendencias();
    }, []);

    if (loading) return <div>Cargando tendencias...</div>;
    if (error) return <div>Error: {error}</div>;

    // Data para el gráfico de barras
    const data = {
        labels: productos.map(producto => producto.nombreProducto),
        datasets: [
            {
                label: 'Cantidad Vendida',
                data: productos.map(producto => producto.cantidadVendidos),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="tendencias-container">
            <h2>Tendencias: Productos Más Vendidos</h2>
            <div className="chart-container">
                <Bar data={data} />
            </div>
        </div>
    );
};

export default Tendencias;
