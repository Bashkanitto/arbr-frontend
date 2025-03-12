import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";
import styles from "./BigRequestsChart.module.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const BigRequestChart: React.FC = () => {
  const labels = ["Янв", "Фев", "Март", "Апр", "Май"];
  const data = [12, 19, 3, 5, 2];

  const chartData = {
    labels,
    datasets: [
      {
        data,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}> Большие запросы</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default BigRequestChart;
