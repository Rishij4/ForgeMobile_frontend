// AIRecommendationCard.jsx
import React from "react";
import { motion } from "framer-motion";

const AIRecommendationCard = ({ analysis }) => {
  if (!analysis) return null;

  // Animation variants for smooth itemized entry
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
      variants={containerVariants}
      className="bg-[#111827] border border-indigo-600/60 rounded-[24px] shadow-[0_0_30px_rgba(79,70,229,0.1)] p-5 sm:p-8 mt-10 text-white relative overflow-hidden"
    >
      {/* Decorative top illumination strip */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-indigo-500 to-red-500 opacity-80" />

      <h2 className="text-2xl sm:text-3xl font-black mb-8 text-white tracking-tight flex items-center gap-2.5">
        <span className="text-indigo-400 font-mono text-lg select-none">//</span>
        AI Recommendation
      </h2>

      {/* STRENGTHS BLOCK */}
      <div className="mb-8 bg-black/20 border border-gray-800/60 rounded-xl p-5 sm:p-6 transition-all hover:border-emerald-500/20">
        <h3 className="text-emerald-400 text-lg font-bold mb-4 tracking-wide uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          Pros
        </h3>
        <ul className="text-gray-300 space-y-3 leading-relaxed text-sm sm:text-base">
          {(analysis.strengths || []).map((item, index) => (
            <motion.li 
              variants={itemVariants}
              key={index} 
              className="flex items-start gap-3 group"
            >
              <span className="text-emerald-400 font-bold select-none mt-0.5 group-hover:scale-110 transition-transform">✓</span>
              <span className="flex-1">{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* WEAKNESSES BLOCK */}
      <div className="mb-8 bg-black/20 border border-gray-800/60 rounded-xl p-5 sm:p-6 transition-all hover:border-red-500/20">
        <h3 className="text-red-400 text-lg font-bold mb-4 tracking-wide uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_#f87171]" />
          Cons
        </h3>
        <ul className="text-gray-300 space-y-3 leading-relaxed text-sm sm:text-base">
          {(analysis.weaknesses || []).map((item, index) => (
            <motion.li 
              variants={itemVariants}
              key={index} 
              className="flex items-start gap-3 group"
            >
              <span className="text-red-400 font-bold select-none mt-0.5 group-hover:scale-110 transition-transform">⚠</span>
              <span className="flex-1">{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* UPGRADE SUGGESTIONS BLOCK */}
      <div className="mb-8 bg-black/20 border border-gray-800/60 rounded-xl p-5 sm:p-6 transition-all hover:border-cyan-500/20">
        <h3 className="text-cyan-400 text-lg font-bold mb-4 tracking-wide uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          Upgrade Suggestions
        </h3>
        <ul className="text-gray-300 space-y-3 leading-relaxed text-sm sm:text-base">
          {(analysis.upgrades || []).map((item, index) => (
            <motion.li 
              variants={itemVariants}
              key={index} 
              className="flex items-start gap-3 group"
            >
              <span className="text-cyan-400 font-bold select-none mt-0.5 group-hover:scale-110 transition-transform">↑</span>
              <span className="flex-1">{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* SUMMARY PANEL */}
      <motion.div
        variants={itemVariants}
        className="mt-6 bg-gradient-to-r from-gray-950 to-gray-900 border border-gray-800/80 rounded-xl p-5 sm:p-6 shadow-inner"
      >
        <div className="flex items-center gap-2 mb-2">
          <strong className="text-indigo-400 uppercase text-xs font-mono tracking-widest">
            AI Summary
          </strong>
        </div>
        <p className="text-gray-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
          {analysis.summary}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AIRecommendationCard;
