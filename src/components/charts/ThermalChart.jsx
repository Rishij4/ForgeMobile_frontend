// ThermalChart.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const ThermalChart = ({ score }) => {
  const data = [
    {
      name: "Thermal",
      score
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4 }}
      className="bg-[#111827] border border-indigo-600/60 rounded-[24px] shadow-[0_0_30px_rgba(79,70,229,0.1)] p-5 sm:p-6 text-white transition-all duration-300 hover:border-indigo-500/20"
    >
      {/* Title Heading */}
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-amber-400 tracking-tight">
        Thermal Score
      </h2>

      {/* Chart Canvas Area */}
      <div className="h-[250px] flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#ffffff" tickLine={false} axisLine={false} />
            <YAxis stroke="#ffffff" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                borderColor: "rgba(99, 102, 241, 0.2)",
                borderRadius: "12px",
                color: "#ffffff"
              }}
              cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
            />
            <Bar
              dataKey="score"
              fill="#f59e0b"
              radius={[6, 6, 0, 0]}
              stroke="none"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Numerical Output String */}
      <p className="text-center text-2xl sm:text-3xl font-black text-amber-400 mt-2 tracking-tight">
        {score}%
      </p>
    </motion.div>
  );
};

export default ThermalChart;