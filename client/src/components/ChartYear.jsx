import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

const ChartYear = ({ yearly = [] }) => {
  const labels = yearly.map((y) => y.year);
  const runs = yearly.map((y) => y.runs);

  const data = {
    labels,
    datasets: [
      {
        label: "Runs",
        data: runs,
        backgroundColor: "rgba(99,102,241,0.92)",
        borderRadius: 6, // rounded bars
        barThickness: 18
      }
    ]
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-lg font-semibold mb-3">Performance by Year</h2>
      <Bar data={data} />
    </div>
  );
};

export default ChartYear;
