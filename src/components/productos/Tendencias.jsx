import React, { useEffect, useState, useRef } from 'react';
import { Global } from '../../helpers/Global';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

Chart.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const Tendencias = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const chartContainerRef = useRef(null);

    // Manejar el cambio de tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
                setProductos([]);  // No hay productos, pero no es error
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



    if (!loading && productos.length === 0) {
        return <div className="tendencias-container tendencias-msg">No hay tendencias para mostrar aún.</div>;
    }
    if (loading) return <div className="tendencias-container tendencias-msg">Cargando tendencias...</div>;
    if (error) return <div className="tendencias-container tendencias-msg">Error: {error}</div>;

    // Genera colores consistentes para cada producto
    const generateConsistentColors = (index) => {
        const colors = [
            'rgba(255, 99, 132, 0.6)', // rosa
            'rgba(54, 162, 235, 0.6)', // azul
            'rgba(255, 206, 86, 0.6)', // amarillo
            'rgba(75, 192, 192, 0.6)', // turquesa
            'rgba(153, 102, 255, 0.6)', // púrpura
            'rgba(255, 159, 64, 0.6)', // naranja
            'rgba(99, 255, 132, 0.6)', // verde claro
            'rgba(235, 162, 54, 0.6)', // naranja claro
        ];

        return colors[index % colors.length];
    };

    // Ordenar productos por cantidad (de mayor a menor)
    const productosOrdenados = [...productos].sort((a, b) => b.cantidadVendidos - a.cantidadVendidos);

    // Limitar a 10 productos para mejor visualización en móvil
    const productosVisibles = isMobile
        ? productosOrdenados.slice(0, 5)
        : productosOrdenados;

    // Acortar nombres largos para mejor visualización
    const formatProductName = (name) => {
        const maxLength = isMobile ? 12 : 20;
        if (name.length > maxLength) {
            return name.substring(0, maxLength - 2) + '...';
        }
        return name;
    };

    // Data para el gráfico de barras
    const data = {
        labels: productosVisibles.map(producto => formatProductName(producto.nombreProducto)),
        datasets: [
            {
                label: 'Cantidad',
                data: productosVisibles.map(producto => producto.cantidadVendidos),
                backgroundColor: productosVisibles.map((_, index) => generateConsistentColors(index)),
                borderWidth: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 100,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: isMobile ? 12 : 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: isMobile ? 11 : 13
                },
                padding: isMobile ? 8 : 10,
                callbacks: {
                    title: (tooltipItems) => {
                        const index = tooltipItems[0].dataIndex;
                        return productosVisibles[index].nombreProducto;
                    },
                    label: (tooltipItem) => {
                        return `Cantidad: ${tooltipItem.raw}`;
                    }
                }
            },
        },
        scales: {
            x: {
                display: true,
                grid: {
                    display: false,
                },
                ticks: {
                    display: true,
                    autoSkip: true,
                    maxRotation: isMobile ? 60 : 45,
                    minRotation: isMobile ? 60 : 45,
                    color: 'rgba(0, 0, 0, 0.6)',
                    font: {
                        size: isMobile ? 8 : 10
                    }
                },
            },
            y: {
                display: true,
                grid: {
                    display: false,
                },
                ticks: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.6)',
                    font: {
                        size: isMobile ? 8 : 10
                    }
                },
            },
        },
    };

    return (
        <div className="tendencias-container">
            <h2 className="tendencias-title">Tendencias</h2>

            {/* Contenedor adaptable para el gráfico */}
            <div className="canva">
                <div className="chart-bar-container" ref={chartContainerRef}>
                    <Bar data={data} options={options} />
                </div>
                {/* Leyenda más organizada y compacta */}
                <div className="legend-container">
                    {productosOrdenados.map((producto, index) => (
                        <div key={producto._id || index} className="legend-item">
                            <div className="legend-color" style={{
                                backgroundColor: generateConsistentColors(index)
                            }}></div>
                            <span className="legend-product-name">
                                {producto.nombreProducto}
                            </span>
                            <span className="legend-quantity">
                                ({producto.cantidadVendidos})
                            </span>
                        </div>
                    ))}
                </div>

            </div>


        </div>
    );
};

export default Tendencias;