import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

Chart.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

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

            const response = await fetch(`${Global.url}producto/listar-todos-los-productos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
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
                backgroundColor: productos.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`),
                borderColor: productos.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`),
                borderWidth: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // Desactiva la leyenda predeterminada del gráfico
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                title: {
                    display: true
                },
                grid: {
                    display: false, // Desactiva la cuadrícula del eje X
                },
            },
            y: {
                title: {
                    display: true
                },
                grid: {
                    display: false, // Desactiva la cuadrícula del eje X
                },
            },
        },
    };

    return (
        <div className="tendencias-container">
            <h2>Tendencias</h2>
            <div className="chart-bar-container">
                <Bar data={data} options={options} />
                <div className="legend-container">
                    {productos.map((producto, index) => (
                        <div key={producto.id} className="legend-item" style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{
                                width: '15px',
                                height: '15px',
                                backgroundColor: data.datasets[0].backgroundColor[index],
                                marginRight: '8px'
                            }}></div>
                            <span>{producto.nombreProducto}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Tendencias;
