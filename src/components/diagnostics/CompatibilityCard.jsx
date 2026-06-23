// CompatibilityCard.jsx
import React from "react";
import { motion } from "framer-motion";

const CompatibilityCard = ({ result }) => {
  if (!result) return null;
  const issues = result?.issues || [];

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.06 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  const metricsMap = [
    { label: "Overall Score:", value: result.overallScore, color: "text-cyan-400" },
    { label: "Performance Score:", value: result.performanceScore, color: "text-cyan-400" },
    { label: "Thermal Score:", value: result.thermalScore, color: "text-amber-400" },
    { label: "Build Quality:", value: result.buildQuality, color: "text-purple-400" },
    { label: "Battery Efficiency:", value: result.batteryEfficiency, color: "text-emerald-400" }
  ];

  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} variants={containerVariants}
      className="bg-[#111827] border border-indigo-600/60 rounded-[24px] shadow-[0_0_30px_rgba(79,70,229,0.1)] p-5 sm:p-8 mt-10 text-white relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-indigo-500 to-red-500 opacity-80" />

      {/* Header Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-gray-800/60">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span className="text-indigo-400 font-mono text-lg select-none">//</span>Compatibility Result
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Hardware configuration analysis metrics and core evaluations.</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold tracking-wide uppercase self-start sm:self-center ${result.compatible ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-red-500/5 border-red-500/20 text-red-400"}`}>
          <span>Compatible: {result.compatible ? "✅ Yes" : "❌ No"}</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8 text-base sm:text-lg text-gray-200">
        {metricsMap.map((metric, i) => (
          <motion.div key={i} variants={itemVariants} className="bg-black/20 p-4 rounded-xl border border-gray-800/60 transition-all hover:border-indigo-500/20">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">{metric.label}</span>
            <p className={`text-2xl sm:text-3xl font-black mt-1 ${metric.color}`}>{metric.value ?? 0}</p>
          </motion.div>
        ))}
      </div>

      {/* Issues Block */}
      <div className="mt-8 border-t border-gray-800/60 pt-6">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-red-400 tracking-tight">Issues</h3>
        {issues.length === 0 ? (
          <motion.div variants={itemVariants} className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
            <p className="text-emerald-400 text-sm sm:text-base font-medium">No issues found ✅</p>
          </motion.div>
        ) : (
          <div className="space-y-2.5">
            {issues.map((item, index) => {
  const issueText =
    typeof item === "object"
      ? item.issue || JSON.stringify(item)
      : item;

  return (
    <motion.div
      key={index}
      variants={itemVariants}
      className="flex items-start gap-2.5 p-3.5 bg-red-500/5 border border-red-500/10 rounded-xl text-sm sm:text-base transition-all hover:border-red-500/20"
    >
      <span className="text-red-400 font-bold select-none mt-0.5">
        !
      </span>

      <p className="text-red-400 leading-8 flex-1">
        • {issueText}
      </p>
    </motion.div>
  );
})}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CompatibilityCard;