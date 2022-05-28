import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top" as const,
        },
        title: {
            display: true,
            text: "Chart.js Bar Chart",
        },
    },
};

const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// const passes = [10, 20, 0, 0, 10, 0, 20];
const passes = [
    {
        pass: true,
        value: 10,
    },
    {
        pass: true,
        value: 10,
    },
    {
        pass: false,
        value: 5,
    },
    {
        pass: false,
        value: 5,
    },
    {
        pass: true,
        value: 10,
    },
    {
        pass: true,
        value: 10,
    },
    {
        pass: true,
        value: 10,
    },
];

export const data = {
    labels,
    datasets: [
        {
            label: "Achievment",
            data: passes.map((p) => p.value),
            // backgroundColor: ["#5be5ba", "#cf2e2e"],
            backgroundColor: passes.map((p) =>
                p.pass ? "#5be5ba" : "#cf2e2e"
            ),
        },
    ],
};

export default function App() {
    return (
        <div style={{ maxWidth: 500 }}>
            <Bar options={options} data={data} />
        </div>
    );
}
