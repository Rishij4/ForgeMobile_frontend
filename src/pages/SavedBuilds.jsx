// SavedBuilds.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiShare2 } from "react-icons/fi";
import API from "../services/api";
import Modal from "../components/common/Modal";
import Navbar from "../components/layout/Navbar";
import MarketCompetitorCard from "../components/lab/MarketCompetitorCard";

const SavedBuilds = () => {
  const [builds, setBuilds] = useState([]);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [competitorBuild, setCompetitorBuild] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [buildToDelete, setBuildToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [expandedBuilds, setExpandedBuilds] = useState({});
  const navigate = useNavigate();

  const fetchBuilds = async () => {
    try {
      const res = await API.get("/builds");
      setBuilds(res.data);
    } catch (error) {
      console.error("Error fetching builds:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBuilds(); }, []);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/builds/${buildToDelete._id}`);
      setBuilds(prev => prev.filter(build => build._id !== buildToDelete._id));
      toast.success("Build deleted successfully");
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setBuildToDelete(null);
    }
  };

  const getComponentName = (key, val) => {
    if (!val) return "N/A";
    const mapArr = (arr) => Array.isArray(arr) ? arr.map(i => typeof i === "string" ? i : i.name).join(", ") : "N/A";
    switch (key) {
      case "processor": return val.name || "N/A";
      case "ram": return `${val.size}GB ${val.type}`;
      case "storage": return `${val.capacity}GB ${val.type}`;
      case "display": return `${val.panelType} ${val.refreshRate}Hz ${val.resolution || ""}`;
      case "battery": return `${val.capacity}mAh`;
      case "camera": return `${val.count} Cameras`;
      case "connectivity": return [val.network?.type, val.wifi?.type, val.bluetooth?.type].filter(Boolean).join(" | ");
      case "audio": return val.speakers || "N/A";
      case "thermal": return val.name || "N/A";
      case "phoneBuild": return val.material || "N/A";
      case "haptics": return val.name || "N/A";
      case "sensors": case "components": return mapArr(val);
      default: return val?.name || "N/A";
    }
  };

  const toggleShowMore = (id) => setExpandedBuilds(p => ({ ...p, [id]: !p[id] }));
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const cardVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

  // Explicit mapping color helper to prevent Tailwind string interpolation failures
  const getColorClasses = (col) => {
    const maps = {
      emerald: { text: "text-emerald-400", bg: "bg-emerald-400" },
      red: { text: "text-red-400", bg: "bg-red-400" },
      cyan: { text: "text-cyan-400", bg: "bg-cyan-400" }
    };
    return maps[col] || { text: "text-gray-400", bg: "bg-gray-400" };
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-medium text-lg tracking-wide">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <span>Loading builds...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-indigo-500/30">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Saved Builds</h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">Manage, load, edit and compare your saved smartphone builds.</p>
        </div>

        {builds.length === 0 ? (
          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-8 text-center text-gray-400"><p className="text-base">No saved builds found.</p></div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {builds.map((build) => (
              <motion.div
                key={build._id} variants={cardVariants}
                whileHover={{ scale: 1.01, y: -4, borderColor: "rgba(99, 102, 241, 0.4)", boxShadow: "0 12px 30px -10px rgba(99, 102, 241, 0.15)" }}
                className="bg-[#111827]/40 backdrop-blur-md border border-gray-800/80 rounded-2xl p-5 sm:p-6 shadow-xl relative flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-gray-800/60">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white line-clamp-2">{build.buildName || "Unnamed Build"}</h2>
                      <div className="mt-1"><span className={`text-xs font-semibold tracking-wide ${build.tested ? "text-emerald-400" : "text-yellow-400"}`}>● {build.tested ? "Tested" : "Not Tested"}</span></div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => { setBuildToDelete(build); setShowDeleteModal(true); }} className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-600/10 hover:bg-red-600 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white transition-all"><FiTrash2 size={16} /></button>
                      <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/shared/${build._id}`); toast.success("Public link copied"); }} className="w-9 h-9 flex items-center justify-center rounded-lg bg-cyan-600/10 hover:bg-cyan-600 border border-cyan-500/20 hover:border-cyan-500 text-cyan-400 hover:text-white transition-all"><FiShare2 size={16} /></button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm text-gray-300 font-medium">
                    <p className="flex justify-between"><span className="text-gray-400 font-normal">Performance:</span><span className="text-white font-bold">{build.performanceScore || 0}</span></p>
                    <p className="flex justify-between"><span className="text-gray-400 font-normal">Estimated Price:</span><span className="text-white font-bold">₹{build.totalPrice || 0}</span></p>
                    {build.marketPrice != null && (
                      <p className="flex justify-between items-center gap-2"><span className="text-gray-400 font-normal">Market Price:</span><span className="text-white font-bold">₹{build.marketPrice.toLocaleString()}{build.marketPriceDate && <span className="text-[11px] font-mono font-normal text-gray-400 ml-1">({new Date(build.marketPriceDate).toLocaleDateString("en-GB")})</span>}</span></p>
                    )}
                    {build.priceDifference !== null && (
                      <p className={`flex justify-between font-bold text-xs sm:text-sm pt-1 border-t border-gray-800/40 ${build.priceDifference > 0 ? "text-red-400" : "text-green-400"}`}>
                        <span>Difference:</span><span>{build.priceDifference > 0 ? `↑ ₹${Math.abs(build.priceDifference).toLocaleString()} higher` : `↓ ₹${Math.abs(build.priceDifference).toLocaleString()} lower`}</span>
                      </p>
                    )}
                    <div className="pt-2 mt-2 border-t border-gray-800/40 text-[11px] sm:text-xs text-gray-400 space-y-1 font-normal">
                      <p>Created: {new Date(build.createdAt).toLocaleDateString()}</p>
                      {new Date(build.updatedAt).getTime() > new Date(build.createdAt).getTime() && <p>Updated: {new Date(build.updatedAt).toLocaleDateString()}</p>}
                    </div>
                  </div>

                  <div className="mt-4 bg-black/20 border border-gray-800/60 rounded-xl p-3 sm:p-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Components</h3>
                    {(() => {
                      const all = Object.entries(build.selectedComponents || {});
                      const visible = expandedBuilds[build._id] ? all : all.slice(0, 5);
                      return (
                        <>
                          <ul className="text-xs text-gray-400 space-y-1.5 font-medium pr-1">
                            {visible.map(([key, value]) => (
                              <li key={key} className="flex gap-1 items-start leading-relaxed"><span className="text-indigo-400 select-none mt-0.5">•</span><span className="text-gray-300 capitalize shrink-0">{key}:</span><span className="text-gray-400 flex-1 break-words">{getComponentName(key, value)}</span></li>
                            ))}
                          </ul>
                          {all.length > 5 && (
                            <button onClick={() => toggleShowMore(build._id)} className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 transition-all">{expandedBuilds[build._id] ? "Show Less" : `Show More (+${all.length - 5})`}</button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-semibold">
                  <button onClick={() => setSelectedBuild(build)} className="bg-indigo-600 hover:bg-indigo-500 text-white transition-all rounded-xl py-2.5 shadow-md shadow-indigo-600/10">View Details</button>
                  <button onClick={() => { sessionStorage.setItem("compareBuild1", build._id); navigate("/compare"); }} className="bg-purple-600/10 hover:bg-purple-600 border border-purple-500/20 hover:border-purple-500 text-purple-400 hover:text-white transition-all rounded-xl py-2.5">Compare</button>
                  <button onClick={() => { sessionStorage.setItem("loadedBuild", JSON.stringify(build)); toast.success("Build loaded successfully"); navigate("/lab"); }} className="bg-emerald-600 hover:bg-emerald-500 text-white transition-all rounded-xl py-2.5 shadow-md shadow-emerald-600/10">Load Build</button>
                  <button onClick={() => { sessionStorage.setItem("editBuild", JSON.stringify(build)); toast.success("Build ready to edit"); navigate("/lab"); }} className="bg-yellow-500 hover:bg-yellow-400 text-black transition-all rounded-xl py-2.5 shadow-md shadow-yellow-500/10">Edit Build</button>
                  <button onClick={() => setCompetitorBuild(build)} className="col-span-2 mt-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl py-2.5 text-xs font-semibold transition-all">View Competitors</button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* DETAILS MODAL - Maximum height parameters added */}
        <AnimatePresence>
          {selectedBuild && (
            <Modal isOpen={!!selectedBuild} onClose={() => setSelectedBuild(null)}>
              <div className="text-gray-200 space-y-4 max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="bg-[#111827] p-5 rounded-2xl border border-indigo-600/40 shadow-lg relative overflow-hidden sticky top-0 z-10">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{selectedBuild.buildName}</h2>
                  <p className="text-gray-400 mt-1 text-xs sm:text-sm">Detailed smartphone build analysis report</p>
                </div>

                <div className="bg-gray-950/60 p-4 rounded-xl border border-gray-800/80 text-sm sm:text-base space-y-2">
                  <p className="flex justify-between items-center"><span className="text-indigo-400 font-semibold">Estimated Price:</span><span className="font-bold text-white">₹{selectedBuild.totalPrice}</span></p>
                  {selectedBuild.marketPrice != null && (
                    <p className="flex justify-between items-center pt-2 border-t border-gray-800/40"><span className="text-indigo-400 font-semibold">Market Price:</span><span className="font-bold text-white">₹{selectedBuild.marketPrice.toLocaleString()}</span></p>
                  )}
                  {selectedBuild.priceDifference !== null && (
                    <p className="flex justify-between items-center pt-2 border-t border-gray-800/40"><span className="text-indigo-400 font-semibold">Price Difference:</span><span className={`font-bold ${selectedBuild.priceDifference > 0 ? "text-red-400" : "text-green-400"}`}>{selectedBuild.priceDifference > 0 ? `↑ ₹${Math.abs(selectedBuild.priceDifference).toLocaleString()} higher` : `↓ ₹${Math.abs(selectedBuild.priceDifference).toLocaleString()} lower`}</span></p>
                  )}
                </div>

                <div className="bg-gray-950/60 p-4 rounded-xl border border-gray-800/80 text-sm space-y-2.5">
                  <h3 className="font-bold text-indigo-400 uppercase tracking-wider text-xs border-b border-gray-800/60 pb-2">Performance Analysis</h3>
                  {selectedBuild.tested ? (
                    <>
                      {[["Compatibility Score", selectedBuild.compatibilityResult.score, "text-cyan-400"], ["Performance Score", selectedBuild.compatibilityResult.performanceScore, "text-cyan-400"], ["Thermal Score", selectedBuild.compatibilityResult.thermalScore, "text-amber-400"], ["Build Quality", selectedBuild.compatibilityResult.buildQuality, "text-purple-400"], ["Battery Efficiency", selectedBuild.compatibilityResult.batteryEfficiency, "text-emerald-400"]].map(([lbl, val, c]) => (
                        <p key={lbl} className="flex justify-between"><span className="text-gray-400">{lbl}:</span><span className={`${c} font-bold`}>{val}</span></p>
                      ))}
                      <p className="flex justify-between pt-1.5 border-t border-gray-800/40"><span className="text-gray-400">Status:</span><span className="text-emerald-400 font-bold">{selectedBuild.compatibilityResult.status}</span></p>
                    </>
                  ) : <p className="text-yellow-400 text-sm leading-relaxed">This build has not been tested yet. Run compatibility test to generate performance analysis.</p>}
                </div>

                <div className="bg-gray-950/60 p-4 rounded-xl border border-gray-800/80 text-sm space-y-4">
                  <h3 className="font-bold text-indigo-400 uppercase tracking-wider text-xs border-b border-gray-800/60 pb-2">AI Recommendation</h3>
                  {selectedBuild.tested ? (
                    [["▲ PROS", "emerald", selectedBuild.aiRecommendation?.strengths], ["▼ CONS", "red", selectedBuild.aiRecommendation?.weaknesses], ["Upgrade Suggestions", "cyan", selectedBuild.aiRecommendation?.upgradeSuggestions]].map(([ttl, col, arr]) => {
                      const colors = getColorClasses(col);
                      return (
                        <div key={ttl} className="space-y-1.5">
                          <h4 className={`text-xs font-bold uppercase tracking-wider ${colors.text} flex items-center gap-1.5`}>
                            <span className={`w-1 h-1 rounded-full ${colors.bg}`} />
                            {ttl}
                          </h4>
                          <ul className="text-gray-300 space-y-1 pl-4 list-disc text-xs leading-relaxed">
                            {arr && arr.length > 0 ? arr.map((item, idx) => <li key={idx}>{item}</li>) : <li className="text-gray-500 list-none pl-0 italic">None analyzed</li>}
                          </ul>
                        </div>
                      );
                    })
                  ) : <div className="py-2"><p className="text-yellow-400 text-sm font-medium">No AI analysis available</p><p className="text-gray-500 text-xs mt-2">Run compatibility test to unlock AI-powered recommendations.</p></div>}
                </div>

                <div className="bg-gray-950/60 p-4 rounded-xl border border-gray-800/80 text-sm space-y-2">
                  <h3 className="font-bold text-red-400 uppercase tracking-wider text-xs border-b border-gray-800/60 pb-2">Issues Detected</h3>
                  {selectedBuild.tested ? (
                    selectedBuild.compatibilityResult?.issues?.length > 0 ? (
                      <ul className="text-red-300 space-y-1.5 pl-4 list-disc text-xs leading-relaxed">{selectedBuild.compatibilityResult.issues.map((issue, idx) => <li key={idx}>{issue.issue || issue}</li>)}</ul>
                    ) : <p className="text-xs text-emerald-400 font-medium">No issues detected.</p>
                  ) : <div className="py-2"><p className="text-yellow-400 text-sm font-medium">No diagnostic data available</p><p className="text-gray-500 text-xs mt-2">Build has not been tested yet.</p></div>}
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>

        {/* COMPETITOR MODAL — Double scroll issue resolved cleanly */}
        <AnimatePresence>
          {competitorBuild && (
            <Modal
              isOpen={!!competitorBuild}
              onClose={() => setCompetitorBuild(null)}
            >
              {/* Outer viewport wrapper with unified scroll handling */}
              <div className="space-y-5 max-h-[82vh] overflow-y-auto pr-2 custom-scrollbar w-full max-w-5xl mx-auto">
                <div className="bg-[#111827] p-5 rounded-2xl border border-cyan-600/40 sticky top-0 z-20 shadow-xl backdrop-blur-md">
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {competitorBuild.buildName || "Untitled Build"}
                  </h2>
                  <p className="text-gray-400 mt-1 text-xs sm:text-sm">
                    Market Competitor Analysis Matrix
                  </p>
                  <div className="mt-3 text-xs sm:text-sm text-gray-300 font-medium flex flex-wrap gap-y-1">
                    <span className="mr-4">
                      Your Build Est: <span className="text-emerald-400 font-bold">₹{competitorBuild.totalPrice?.toLocaleString()}</span>
                    </span>
                    <span>
                      Market Placement Price: <span className="text-cyan-400 font-bold">₹{competitorBuild.marketPrice?.toLocaleString() || "N/A"}</span>
                    </span>
                  </div>
                </div>

                {/* Component block with modular borders stripped out */}
                <div className="w-full px-0.5">
                  <MarketCompetitorCard
                    phones={competitorBuild.competitorPhones || []}
                    userConfig={competitorBuild.selectedComponents}
                    isModalView={true} 
                  />
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>
        {/* DELETE CONFIRMATION MODAL */}
        <AnimatePresence>
          {showDeleteModal && (
            <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setBuildToDelete(null); }}>
              <div className="text-center py-4 px-2">
                <h2 className="text-xl font-bold text-white mb-4">Delete Build?</h2>
                <p className="text-gray-400 mb-6">Are you sure you want to delete <span className="text-red-400 font-semibold"> {buildToDelete?.buildName}</span>?</p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => { setShowDeleteModal(false); setBuildToDelete(null); }} className="px-6 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all text-white">No</button>
                  <button onClick={confirmDelete} disabled={deleting} className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 transition-all text-white disabled:opacity-50">{deleting ? "Deleting..." : "Yes Delete"}</button>
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SavedBuilds;
