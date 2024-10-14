import { useEffect } from "react";
import { Chart } from "chart.js";

const useDoughnutChart = (canvasId, data, options) => {
    useEffect(() => {
        const ctx = document.getElementById(canvasId).getContext("2d");

        const myChart = new Chart(ctx, {
            type: "doughnut",
            data: data,
            options: options,
        });

        // Cleanup function to destroy the chart instance when component unmounts
        return () => {
            myChart.destroy();
        };
    }, [canvasId, data, options]);
};

export default useDoughnutChart;
