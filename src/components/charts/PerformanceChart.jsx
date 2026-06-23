// PerformanceChart.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer
} from "recharts";

const PerformanceChart = ({ score }) => {
  const data = [
    {
      name: "Performance",
      value: score,
      fill: "#06b6d4"   // cyan
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
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-cyan-400 tracking-tight">
        Performance
      </h2>

      {/* Chart Canvas Area */}
      <div className="h-[250px] flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height={250}>
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar
              minAngle={15}
              dataKey="value"
              fill="#06b6d4"
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Numerical Output String */}
      <p className="text-center text-2xl sm:text-3xl font-black text-cyan-400 mt-2 tracking-tight">
        {score}%
      </p>
    </motion.div>
  );
};

export default PerformanceChart;