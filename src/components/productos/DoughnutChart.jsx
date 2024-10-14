import React from "react";
import useDoughnutChart from "../../hooks/useDoughnutChart";

const DoughnutChart = () => {
    const data = {
        labels: ["Spring", "Summer", "Fall", "Winter"],
        datasets: [
            {
                data: [1200, 1700, 800, 200],
                backgroundColor: [
                    "rgba(255, 0, 0, 0.5)",
                    "rgba(100, 255, 0, 0.5)",
                    "rgba(200, 50, 255, 0.5)",
                    "rgba(0, 100, 255, 0.5)",
                ],
            },
        ],
    };

    const options = {
        title: {
            display: true,
            text: "Weather",
        },
    };

    // Usamos el hook con el ID del canvas
    useDoughnutChart("chart-line", data, options);

    return (
        <div className="page-content">
            <div className="card">
                <div className="card-header">Doughnut chart</div>
                <div className="card-body">
                    <canvas
                        id="chart-line"
                        width="299"
                        height="200"
                        style={{ display: "block", width: "299px", height: "200px" }}
                    ></canvas>
                </div>
            </div>
        </div>
    );
};

export default DoughnutChart;
