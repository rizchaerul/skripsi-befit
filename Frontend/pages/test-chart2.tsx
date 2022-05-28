import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
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
            text: "Chart.js Line Chart",
        },
    },
};

// const labels = ["January", "February", "March", "April", "May", "June", "July"];
const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
            label: "Dataset 1",
            // data: labels.map(() => Math.random() * 1000),
            borderColor: "#7d98a6",
            // backgroundColor: "rgba(255, 99, 132, 0.5)",
            data: passes.map((p) => p.value),
            // backgroundColor: ["#5be5ba", "#cf2e2e"],
            backgroundColor: passes.map((p) =>
                p.pass ? "#5be5ba" : "#cf2e2e"
            ),
        },
    ],
};

export default function App() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <Line options={options} data={data} />;
}
