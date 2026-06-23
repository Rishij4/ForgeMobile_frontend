// PhonePreview.jsx
import { useState } from "react";
import PhoneRender from "./PhoneRender";
import SpecSheet from "./SpecSheet";
import Phone3D from "./Phone3D";

const PhonePreview = ({
  config,
  analysis,
  isTesting,
  scanStage,
  liveMetrics
}) => {
  const [viewMode, setViewMode] = useState("xray");
  
  return (
    <div
      className="w-full max-w-full bg-[#0B1220] border border-indigo-500/30 rounded-3xl p-5 shadow-2xl backdrop-blur-sm h-auto overflow-visible"
    >
      {/* TOP BAR */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Live Build Preview
          </h2>
          {/* VIEW TOGGLE */}
          <div className="flex gap-2 mt-4">
            {["front", "back", "xray", "3d"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-medium uppercase transition-all ${
                  viewMode === mode
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-900 text-gray-400"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Real-time smartphone assembly visualization
          </p>
        </div>

        <div className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex-shrink-0">
          <span className="text-xs text-indigo-400">Assembly Engine</span>
        </div>
      </div>

      {/* MAIN PHONE RENDER LAYER */}
      <div className="w-full overflow-visible">
        {viewMode === "3d" ? (
          <Phone3D config={config} />
        ) : (
          <PhoneRender
            config={config}
            analysis={analysis}
            isTesting={isTesting}
            viewMode={viewMode}
            scanStage={scanStage}
            metrics={liveMetrics}
          />
        )}
      </div>

      {/* DIAGNOSTIC PANEL */}
      <div className="mt-5 border-t border-gray-800/60 pt-4">
        <SpecSheet config={config} />
      </div>

    </div>
  );
};

export default PhonePreview;