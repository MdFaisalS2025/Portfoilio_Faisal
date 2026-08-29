"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const DATA = {
  labels: ["Texas", "Florida", "Washington", "Colorado", "Utah"],
  datasets: [
    {
      label: "GDP growth (%)",
      data: [4.1, 3.8, 3.6, 3.3, 3.1],
      backgroundColor: "#9a3324",
      borderRadius: 0,
    },
  ],
};

const options = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#525252" } },
    y: { grid: { color: "rgba(17,17,17,0.08)" }, ticks: { color: "#525252" } },
  },
};

export function DataExplorerDemo() {
  const [answered, setAnswered] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      <div className="flex-1 max-w-md">
        <div className="rounded-none border border-espresso/10 bg-parchment p-4">
          <div className="flex items-start gap-2 mb-4">
            <div className="rounded-none rounded-tl-sm bg-espresso/10 px-4 py-2 text-sm">
              Which state had the highest GDP growth?
            </div>
          </div>
          {!answered ? (
            <button
              type="button"
              onClick={() => setAnswered(true)}
              className="text-sm text-terracotta-dark font-medium hover:underline"
            >
              Ask the explorer →
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <div className="rounded-none rounded-tr-sm bg-terracotta/15 px-4 py-2 text-sm max-w-[85%]">
                Texas led with 4.1% GDP growth, based on live World Bank data.
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <Bar data={DATA} options={options} />
      </div>

      <div className="flex-1 max-w-xs">
        <p className="text-sm text-espresso-soft mb-3">Schema-first ERD</p>
        <svg viewBox="0 0 220 160" className="w-full">
          {[
            { x: 10, y: 10, label: "State" },
            { x: 110, y: 10, label: "Indicator" },
            { x: 60, y: 100, label: "Observation" },
          ].map((box) => (
            <g key={box.label} className="group">
              <rect
                x={box.x}
                y={box.y}
                width="100"
                height="40"
                rx="8"
                fill="var(--color-sage)"
                fillOpacity="0.15"
                stroke="var(--color-sage-dark)"
                strokeWidth="1.5"
                className="transition-[fill-opacity] group-hover:fill-opacity-30"
              />
              <text x={box.x + 50} y={box.y + 24} textAnchor="middle" fontSize="11" fill="var(--color-espresso)">
                {box.label}
              </text>
            </g>
          ))}
          <line x1="60" y1="50" x2="90" y2="100" stroke="var(--color-espresso)" strokeOpacity="0.25" strokeWidth="1.5" />
          <line x1="160" y1="50" x2="120" y2="100" stroke="var(--color-espresso)" strokeOpacity="0.25" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}
