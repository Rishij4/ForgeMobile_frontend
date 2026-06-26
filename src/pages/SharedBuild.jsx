// SharedBuild.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicBuild } from "../services/buildService";

const SharedBuild = () => {
  const { id } = useParams();
  const [build, setBuild] = useState(null);

  useEffect(() => {
    (async () => {
      try { setBuild(await getPublicBuild(id)); } 
      catch (error) { console.log(error); }
    })();
  }, [id]);

  const formatComponent = (key, value) => {
    if (!value) return "Not Selected";
    
    // Renders all items in the array cleanly separated by commas
    const fullMap = (arr) => arr.map(i => i.name).join(", ");
    
    switch (key) {
      case "processor": case "display": return value.name;
      case "ram": return `${value.size}GB ${value.type}`;
      case "storage": return `${value.capacity}GB ${value.type}`;
      case "battery": return `${value.capacity}mAh`;
      case "camera": return `${value.count} Cameras`;
      case "connectivity": return `${value.network?.type || ""} | ${value.wifi?.type || ""} | ${value.bluetooth?.type || ""}`;
      case "audio": return value.speakers || value.name;
      case "thermal": return value.name || "Not Selected";
      case "phoneBuild": return value.material || "Not Selected";
      case "haptics": return value.name;
      case "sensors": case "components": return fullMap(value);
      default: return typeof value === "object" ? value.name || "Custom Component" : value;
    }
  };

  if (!build) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center font-medium tracking-wide p-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm sm:text-base">Loading Build...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-indigo-500/30 px-3 xs:px-4 sm:px-8 py-6 sm:py-12">
      <div className="w-full max-w-4xl mx-auto bg-[#111827]/40 backdrop-blur-md p-4 xs:p-6 sm:p-10 rounded-2xl border border-indigo-600/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-80" />

        {/* HEADER PANEL */}
        <div className="bg-black border border-gray-800/80 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 relative">
          <p className="text-indigo-400 font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase">FORGEMOBILE PUBLIC BUILD</p>
          <h1 className="text-xl sm:text-4xl font-black mt-2 text-white tracking-tight break-words">{build.buildName}</h1>
          <div className="mt-2"><span className={`text-xs sm:text-sm font-semibold ${build.tested ? "text-green-400" : "text-yellow-400"}`}>● {build.tested ? "Tested" : "Not Tested"}</span></div>
          <p className="text-green-400 text-lg sm:text-2xl font-bold mt-4 flex flex-wrap items-baseline gap-1.5"><span className="text-gray-500 text-xs sm:text-sm font-normal uppercase tracking-wider block sm:inline">Estimated Price:</span>₹{build.totalPrice}</p>
        </div>

        {/* DIAGNOSTIC MATRIX HERO CARD */}
        <div className="bg-black border border-gray-800/80 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-[10px] sm:text-xs font-bold text-indigo-400 tracking-wider uppercase mb-4 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />PERFORMANCE ANALYSIS</h2>
          {build.tested ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-gray-300">
              {[
                { l: "Compatibility Score:", v: build.compatibilityResult?.score, c: "text-white" },
                { l: "Performance Score:", v: build.compatibilityResult?.performanceScore, c: "text-cyan-400" },
                { l: "Thermal Score:", v: build.compatibilityResult?.thermalScore, c: "text-orange-400" },
                { l: "Battery Efficiency:", v: build.compatibilityResult?.batteryEfficiency, c: "text-green-400" }
              ].map((item, i) => (
                <div key={i} className="bg-[#111827]/40 p-3 rounded-lg border border-gray-900 flex justify-between items-center gap-2">
                  <span className="truncate">{item.l}</span>
                  <span className={`${item.c} font-bold shrink-0`}>{item.v}</span>
                </div>
              ))}
              <div className="bg-[#111827]/40 p-3 rounded-lg border border-gray-900 flex justify-between items-center gap-2 sm:col-span-2">
                <span>Status:</span>
                <span className="text-indigo-400 font-bold shrink-0 text-right break-words max-w-[60%]">{build.compatibilityResult?.status}</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#111827]/30 border border-yellow-500/20 rounded-xl p-4 sm:p-6 text-center">
              <p className="text-yellow-400 font-semibold text-base sm:text-lg">⚠ Build Not Tested</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-2">This build has not gone through compatibility testing yet.</p>
              <p className="text-gray-500 text-[11px] sm:text-xs mt-3">Performance metrics are unavailable.</p>
            </div>
          )}
        </div>

        {/* COMPONENT SPECS HUB */}
        <div className="bg-black border border-gray-800/80 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-[10px] sm:text-xs font-bold text-indigo-400 tracking-wider uppercase mb-4 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />COMPONENTS</h2>
          <div className="divide-y divide-gray-900 text-xs sm:text-sm font-medium">
            {Object.entries(build.selectedComponents || {}).map(([key, value]) => (
              <div key={key} className="flex flex-col xs:flex-row justify-between items-start xs:items-center py-3 gap-1 xs:gap-4 hover:bg-white/[0.01] transition-colors">
                <span className="text-gray-400 font-normal text-[11px] xs:text-sm uppercase xs:normal-case tracking-wider xs:tracking-normal shrink-0">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
                
                {/* Changed layout rules below to support full string multi-line wrap styling */}
                <span className="text-left xs:text-right w-full xs:max-w-xs sm:max-w-lg text-white font-semibold block xs:inline break-words">
                  {formatComponent(key, value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM FOOLPROOF WRAPPER */}
        <div className="text-center space-y-4 pt-4 border-t border-gray-900">
          <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest font-mono">Built with FORGEMOBILE</p>
          <p className="text-gray-600 text-[11px] sm:text-xs font-medium">Created on {new Date(build.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <Link to="/" className="inline-block w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-sm tracking-wide shadow-lg transform transition-all duration-200 active:scale-[0.98] uppercase text-center">Build Your Own</Link>
        </div>
      </div>
    </div>
  );
};

export default SharedBuild;
