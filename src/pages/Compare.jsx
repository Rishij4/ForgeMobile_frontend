// Compare.jsx
import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const Compare = () => {
  const [builds, setBuilds] = useState([]);
  const [build1, setBuild1] = useState("");
  const [build2, setBuild2] = useState("");

  useEffect(() => {
    const loadBuilds = async () => {
      try {
        const res = await API.get("/builds");
        setBuilds(res.data);

        const savedCompareBuild = sessionStorage.getItem("compareBuild1");
        if (savedCompareBuild) {
          setBuild1(savedCompareBuild);
          sessionStorage.removeItem("compareBuild1");
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadBuilds();
  }, []);

  const selectedBuild1 = builds.find((build) => build._id === build1);
  const selectedBuild2 = builds.find((build) => build._id === build2);

  const performanceWinner =
    selectedBuild1 &&
    selectedBuild2 &&
    selectedBuild1.compatibilityResult.performanceScore ===
    selectedBuild2.compatibilityResult.performanceScore
      ? "Tie"
      : (selectedBuild1?.compatibilityResult?.performanceScore >
         selectedBuild2?.compatibilityResult?.performanceScore)
      ? selectedBuild1.buildName
      : selectedBuild2?.buildName;

  const batteryWinner =
    selectedBuild1 &&
    selectedBuild2 &&
    (selectedBuild1.compatibilityResult.batteryEfficiency >
     selectedBuild2.compatibilityResult.batteryEfficiency)
      ? selectedBuild1.buildName
      : selectedBuild2?.buildName;

  const thermalWinner =
    selectedBuild1 &&
    selectedBuild2 &&
    (selectedBuild1.compatibilityResult.thermalScore >
     selectedBuild2.compatibilityResult.thermalScore)
      ? selectedBuild1.buildName
      : selectedBuild2?.buildName;

  const priceWinner =
    selectedBuild1 &&
    selectedBuild2 &&
    (selectedBuild1.totalPrice < selectedBuild2.totalPrice)
      ? selectedBuild1.buildName
      : selectedBuild2?.buildName;

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-indigo-500/30">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* PAGE HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Compare Builds
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Compare two saved smartphone builds side by side.
          </p>
        </div>

        {/* BUILD SELECTORS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BUILD 1 */}
          <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800/60 p-5 rounded-2xl shadow-xl">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Select Build 1
            </label>
            <select
              value={build1}
              onChange={(e) => setBuild1(e.target.value)}
              className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium"
            >
              <option value="">Choose Build 1</option>
              {builds.map((build) => (
                <option key={build._id} value={build._id} disabled={build._id === build2}>
                  {build.buildName}
                </option>
              ))}
            </select>
          </div>

          {/* BUILD 2 */}
          <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800/60 p-5 rounded-2xl shadow-xl">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Select Build 2
            </label>
            <select
              value={build2}
              onChange={(e) => setBuild2(e.target.value)}
              className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium"
            >
              <option value="">Choose Build 2</option>
              {builds.map((build) => (
                <option key={build._id} value={build._id} disabled={build._id === build1}>
                  {build.buildName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* DATA COMPARISON SHEET DISPLAY NODE */}
        <AnimatePresence mode="wait">
          {selectedBuild1 && selectedBuild2 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mt-12 bg-gray-900/40 backdrop-blur-md border border-gray-800/80 rounded-2xl shadow-2xl p-5 sm:p-8 relative overflow-hidden"
            >
              {/* Top Accent Gradient Identification Line */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-yellow-500 opacity-80" />

              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-white tracking-tight flex items-center gap-2.5">
                <span className="text-indigo-400 font-mono text-lg select-none">//</span>
                Comparison Result
              </h2>

              {/* TECHNICAL PARAMETERS MATRIX TABLE */}
              <div className="overflow-x-auto rounded-xl border border-gray-800/60 bg-black/20">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-950/40 text-gray-400 font-semibold">
                      <th className="text-left py-4 px-4 font-bold uppercase tracking-wider text-xs">Category</th>
                      <th className="text-left py-4 px-4 font-bold text-indigo-400">{selectedBuild1.buildName}</th>
                      <th className="text-left py-4 px-4 font-bold text-indigo-400">{selectedBuild2.buildName}</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-900 text-gray-300 font-medium">
                    <tr className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 px-4 text-gray-400 font-normal">Processor</td>
                      <td className="py-4 px-4">{selectedBuild1?.selectedComponents?.processor?.name}</td>
                      <td className="py-4 px-4">{selectedBuild2?.selectedComponents?.processor?.name}</td>
                    </tr>

                    <tr className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 px-4 text-gray-400 font-normal">RAM</td>
                      <td className="py-4 px-4">
                        {selectedBuild1?.selectedComponents?.ram?.size}GB{" "}
                        {selectedBuild1?.selectedComponents?.ram?.type}
                      </td>
                      <td className="py-4 px-4">
                        {selectedBuild2?.selectedComponents?.ram?.size}GB{" "}
                        {selectedBuild2?.selectedComponents?.ram?.type}
                      </td>
                    </tr>

                    <tr className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 px-4 text-gray-400 font-normal">Storage</td>
                      <td className="py-4 px-4">
                        {selectedBuild1?.selectedComponents?.storage?.capacity}GB{" "}
                        {selectedBuild1?.selectedComponents?.storage?.type}
                      </td>
                      <td className="py-4 px-4">
                        {selectedBuild2?.selectedComponents?.storage?.capacity}GB{" "}
                        {selectedBuild2?.selectedComponents?.storage?.type}
                      </td>
                    </tr>

                    <tr className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 px-4 text-gray-400 font-normal">Battery</td>
                      <td className="py-4 px-4">{selectedBuild1?.selectedComponents?.battery?.capacity}mAh</td>
                      <td className="py-4 px-4">{selectedBuild2?.selectedComponents?.battery?.capacity}mAh</td>
                    </tr>

                    <tr className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 px-4 text-gray-400 font-normal">Camera</td>
                      <td className="py-4 px-4">{selectedBuild1?.selectedComponents?.camera?.count} Cameras</td>
                      <td className="py-4 px-4">{selectedBuild2?.selectedComponents?.camera?.count} Cameras</td>
                    </tr>

                    <tr className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 px-4 text-gray-400 font-normal">Performance Score</td>
                      <td className="py-4 px-4 text-cyan-400 font-bold">{selectedBuild1?.compatibilityResult?.performanceScore}</td>
                      <td className="py-4 px-4 text-cyan-400 font-bold">{selectedBuild2?.compatibilityResult?.performanceScore}</td>
                    </tr>

                    <tr className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 px-4 text-gray-400 font-normal">Battery Efficiency</td>
                      <td className="py-4 px-4 text-green-400 font-bold">{selectedBuild1?.compatibilityResult?.batteryEfficiency}</td>
                      <td className="py-4 px-4 text-green-400 font-bold">{selectedBuild2?.compatibilityResult?.batteryEfficiency}</td>
                    </tr>

                    <tr className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 px-4 text-gray-400 font-normal">Thermal Score</td>
                      <td className="py-4 px-4 text-orange-400 font-bold">{selectedBuild1?.compatibilityResult?.thermalScore}</td>
                      <td className="py-4 px-4 text-orange-400 font-bold">{selectedBuild2?.compatibilityResult?.thermalScore}</td>
                    </tr>

                    <tr className="hover:bg-white/[0.01] transition-colors bg-gray-950/20">
                      <td className="py-4 px-4 text-gray-400 font-normal">Estimated Price</td>
                      <td className="py-4 px-4 font-bold text-white">₹{selectedBuild1?.totalPrice}</td>
                      <td className="py-4 px-4 font-bold text-white">₹{selectedBuild2?.totalPrice}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* CORE COMPETENCY WINNER ANALYTICS HUB */}
              <div className="mt-10 border-t border-gray-800/60 pt-8">
                <h3 className="text-xl font-bold mb-6 text-white tracking-tight">
                  Winner Analysis
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* Best Performance */}
                  <div className="bg-gray-950/40 p-5 rounded-xl border border-gray-800/60 transition-colors hover:border-cyan-500/20">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-3">
                      Best Performance
                    </span>
                    <p className="text-lg font-bold text-cyan-400 leading-relaxed">
                      {performanceWinner}
                    </p>
                  </div>

                  {/* Best Battery */}
                  <div className="bg-gray-950/40 p-5 rounded-xl border border-gray-800/60 transition-colors hover:border-green-500/20">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-3">
                      Best Battery
                    </span>
                    <p className="text-lg font-bold text-green-400 leading-relaxed">
                      {batteryWinner}
                    </p>
                  </div>

                  {/* Best Thermal */}
                  <div className="bg-gray-950/40 p-5 rounded-xl border border-gray-800/60 transition-colors hover:border-orange-500/20">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-3">
                      Best Thermal
                    </span>
                    <p className="text-lg font-bold text-orange-400 leading-relaxed">
                      {thermalWinner}
                    </p>
                  </div>

                  {/* Cheapest Build */}
                  <div className="bg-gray-950/40 p-5 rounded-xl border border-gray-800/60 transition-colors hover:border-yellow-500/20">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-3">
                      Cheapest Build
                    </span>
                    <p className="text-lg font-bold text-yellow-400 leading-relaxed">
                      {priceWinner}
                    </p>
                  </div>

                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Compare;