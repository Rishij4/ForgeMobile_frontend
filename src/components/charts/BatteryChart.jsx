// BatteryChart.jsx
import React from "react";
import { motion } from "framer-motion";
import {PieChart, Pie, ResponsiveContainer} from "recharts";

const BatteryChart = ({ score }) => {
  const data = [{name: "Battery", value: score}];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4 }}
      className="bg-[#111827] border border-indigo-600/60 rounded-[24px] shadow-[0_0_30px_rgba(79,70,229,0.1)] p-5 sm:p-6 text-white transition-all duration-300 hover:border-indigo-500/20"
    >
      {/* Title Heading */}
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-emerald-400 tracking-tight">
        Battery Efficiency
      </h2>

      {/* Chart Canvas Area */}
      <div className="h-[250px] flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={80}
              fill="#10b981"
              stroke="none"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Numerical Output String */}
      <p className="text-center text-2xl sm:text-3xl font-black text-emerald-400 mt-2 tracking-tight">
        {score}%
      </p>
    </motion.div>
  );
};

export default BatteryChart;