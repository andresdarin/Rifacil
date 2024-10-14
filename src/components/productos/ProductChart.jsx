import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js';

const ProductChart = ({ productos }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartData = productos.map((producto) => producto.precio);
        const chartLabels = productos.map((producto) => producto.nombreProducto);

        const ctx = chartRef.current.getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: chartLabels,
                datasets: [{
                    data: chartData,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.75)",
                        "rgba(54, 162, 235, 0.75)",
                        "rgba(255, 206, 86, 0.75)",
                        "rgba(75, 192, 192, 0.75)",
                        "rgba(153, 102, 255, 0.75)",
                        "rgba(255, 159, 64, 0.75)"
                    ],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribución de Precios de Productos',
                        align: 'center'
                    },
                },
            }
        });

        return () => {
            myChart.destroy();
        };
    }, [productos]);

    return (
        <div style={{ height: '400px' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default ProductChart;
