// Tiers.jsx
import Navbar from "../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";
import { presets } from "../data/presets";

const tiers = [
  {
    name: "ECO",
    color: "border-l-green-500",
    button: "bg-green-500 hover:bg-green-400 text-black shadow-green-500/10",
    description: "Affordable build optimized for daily usage.",
    suitableFor: ["Students", "Senior Citizens", "Budget Buyers", "Casual Users", "First-Time Users"]
  },
  {
    name: "STANDARD",
    color: "border-l-indigo-500",
    button: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/10",
    description: "Balanced performance for multitasking users.",
    suitableFor: ["College Students", "Office Professionals", "Multitaskers", "Remote Workers", "Power Users"]
  },
  {
    name: "TITAN",
    color: "border-l-orange-500",
    button: "bg-orange-500 hover:bg-orange-400 text-black shadow-orange-500/10",
    description: "Maximum flagship level performance.",
    suitableFor: ["Gamers", "Content Creators", "Video Editors", "Tech Enthusiasts", "Photographers"]
  }
];

const Tiers = () => {
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState({});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="bg-black min-h-screen text-white antialiased selection:bg-indigo-500/30">
      <Navbar />

      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-24">
          <h1 className="text-4xl sm:text-6xl font-black text-center mb-4 tracking-tighter text-white uppercase">THE TIERS</h1>
          <p className="text-gray-400 text-center max-w-2xl mx-auto text-base sm:text-xl font-medium mb-4">Start your smartphone build with intelligent presets.</p>
          <p className="text-gray-500 text-center max-w-4xl mx-auto text-sm sm:text-base leading-relaxed mb-3">
            ForgeMobile offers three performance tiers — <span className="text-green-400 font-semibold">ECO</span>,{" "}
            <span className="text-indigo-400 font-semibold">STANDARD</span>, and <span className="text-orange-400 font-semibold">TITAN</span> — designed for different usage needs, budgets, and performance levels.
          </p>
          <p className="text-gray-500 text-center max-w-4xl mx-auto text-sm sm:text-base leading-relaxed">
            Presets are recommended starting configurations for specific user types. You can fully customize, upgrade, or modify any selected component later inside <span className="text-indigo-400">The Lab</span>.
          </p>
        </div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {tiers.map((tier, index) => (
            <motion.div
              key={index} variants={cardVariants} whileHover={{ y: -6, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.4)" }}
              className={`bg-[#111827]/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-gray-800/80 border-l-4 ${tier.color} shadow-xl flex flex-col justify-between transition-all duration-300`}
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-black mb-3 tracking-tight text-white">{tier.name}</h2>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed font-medium">{tier.description}</p>

                <div className="mb-8 pt-4 border-t border-gray-800/40">
                  <p className="text-xs text-gray-500 uppercase mb-3">Suitable For</p>
                  <select
                    value={selectedOptions[tier.name] || ""}
                    onChange={(e) => setSelectedOptions(prev => ({ ...prev, [tier.name]: e.target.value }))}
                    className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm text-white"
                  >
                    <option value="">Select User Type</option>
                    {tier.suitableFor.map((option, i) => (
                      <option key={i} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  const selected = selectedOptions[tier.name];
                  if (!selected) return toast.error("Please select a category");

                  sessionStorage.setItem("selectedPreset", JSON.stringify({
                    tier: tier.name, category: selected, config: presets[tier.name][selected]
                  }));
                  navigate("/lab");
                }}
                className={`${tier.button} w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wider shadow-lg transition-all transform duration-200 active:scale-[0.98] uppercase`}
              >
                APPLY PRESET
              </button>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center px-4">
          <p className="text-gray-500 text-sm sm:text-base max-w-4xl mx-auto leading-relaxed font-medium">
            💡 <span className="text-gray-400 font-bold">Tip:</span> Before finalizing your build, review every selected component carefully and make adjustments based on your personal preferences.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Tiers;