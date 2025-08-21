import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Global } from '../../../../../helpers/Global';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

export const TopProductos = () => {
    const [productos, setProductos] = useState([]);
    const [todosLosProductos, setTodosLosProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchTopProductos = async () => {
            try {
                const response = await fetch(`${Global.url}producto/listar-todos-los-productos`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const data = await response.json();

                if (Array.isArray(data.products)) {
                    const ordenados = data.products
                        .sort((a, b) => (b.cantidadVendidos || 0) - (a.cantidadVendidos || 0));

                    const topProductos = ordenados.slice(0, 5);
                    const podioOrden = [4, 2, 0, 1, 3];
                    const podioProductos = podioOrden.map(i => topProductos[i]).filter(Boolean);

                    setProductos(podioProductos);           // gráfico
                    setTodosLosProductos(ordenados);

                    setProductos(podioProductos);
                } else {
                    console.error('No se encontraron productos válidos.');
                }
            } catch (error) {
                console.error("Error al cargar productos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopProductos();
    }, [token]);

    if (loading) return <p>Cargando gráfico...</p>;
    if (productos.length === 0) return <p>No se encontraron productos para mostrar.</p>;

    const colores = ['#EFBF04', '#C0C0C0', '#CD7F32', '#76b5c5', '#aaa'];

    const chartData = {
        labels: productos.map(p => p.nombreProducto), // Sin labels
        datasets: [
            {
                label: 'Cantidad Vendida',
                data: productos.map(p => p.cantidadVendidos || 0),
                backgroundColor: colores,
                borderColor: colores,
                borderWidth: 1,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
            datalabels: {
                anchor: 'end',
                align: 'end',
                color: '#000',
                font: {
                    weight: 'bold',
                    size: 14
                },
                formatter: (value) => value
            }
        },
        scales: {
            x: {
                grid: {
                    display: false, // Desactiva la cuadrícula del eje X
                    drawBorder: false // Elimina la línea del borde inferior
                },
                ticks: {
                    display: false, // Desactiva las marcas de los ticks en el eje X
                },
                borderWidth: 0 // Elimina la línea del borde inferior
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: false, // Desactiva la cuadrícula del eje Y
                    drawBorder: false // Elimina la línea del borde izquierdo
                },
                ticks: {
                    display: false, // Desactiva las marcas de los ticks en el eje Y
                },
                borderWidth: 0 // Elimina la línea del borde izquierdo
            }
        }
    };



    return (
        <div className="meta-chart-container">
            <h2 className="meta-chart-emoji">🏆</h2>
            <Bar data={chartData} options={options} />

            <div className='chart-text'>
                {productos.map((p, index) => (
                    <div key={index} style={{ width: '20%' }}>
                        {p.nombreProducto}
                    </div>
                ))}
            </div>

            <div className='lista-topproductos'>
                {todosLosProductos.map((p, index) => (
                    <div key={index} className='topproducto-item'>
                        <div className='topproducto-nombre'>{p.nombreProducto}</div>
                        <div className='topproducto-cantidad'>{p.cantidadVendidos || 0}</div>
                    </div>
                ))}
            </div>

        </div>
    );
};
