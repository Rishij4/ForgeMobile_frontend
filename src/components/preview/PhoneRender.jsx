// PhoneRender.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const PhoneRender = ({
  config,
  analysis,
  isTesting,
  viewMode,
  scanStage,
  metrics
}) => {
  let bodyTheme = "premium";

  if (config.phoneBuild) {
    const build =
      typeof config.phoneBuild === "string"
        ? config.phoneBuild.toLowerCase()
        : config.phoneBuild?.name?.toLowerCase() || "";

    if (build.includes("gaming")) {
      bodyTheme = "gaming";
    } else if (build.includes("eco")) {
      bodyTheme = "eco";
    } else if (build.includes("budget")) {
      bodyTheme = "budget";
    } else if (build.includes("camera")) {
      bodyTheme = "camera";
    } else {
      bodyTheme = "premium";
    }
  }

  const bodyStyles = {
    premium: "from-gray-500 via-gray-700 to-black",
    gaming: "from-red-700 via-red-900 to-black",
    eco: "from-green-600 via-green-800 to-black",
    budget: "from-blue-700 via-slate-800 to-black",
    camera: "from-yellow-600 via-amber-700 to-black",
  };

  // Safe Fallback Spec Manifest Extractions (Matching Image 3 Data Deck)
  const chipName = config.processor?.name || "Not Selected";
  const chipDetails = config.processor ? `${config.processor.processNode || "4nm"} • ${config.processor.cores || "Octa-core"} • ${config.processor.clockSpeed || "3.3GHz"}` : "NA";
  
  const ramDetails = config.ram ? `${config.ram.size || 12} GB ${config.ram.type || "LPDDR5X"}` : "Not Selected";
  const ramSpeed = config.ram?.speed ? `${config.ram.speed} Mbps` : "NA";
  
  const storageDetails = config.storage ? `${config.storage.capacity || 256} GB ${config.storage.type || "UFS 4.0"}` : "Not Selected";
  const storageSpeed = config.storage?.readSpeed ? `Read: ${config.storage.readSpeed} MB/s` : "NA";
  
  const displayDetails = config.display?.panelType ? `${config.display.panelType} Display` : "Not Selected";
  const displayHz = config.display?.refreshRate ? `${config.display.refreshRate}Hz Refresh Rate` : "Not Selected";
  
  const batteryCapacity = config.battery?.capacity ? `${config.battery.capacity} mAh Battery` : "Not Selected";
  const batterySpeed = config.battery?.chargingSpeed ? `Fast Charging ${config.battery.chargingSpeed}W` : "Not Selected";

  const hapticMotorName = config.haptics?.name || "Not Selected";

  return (
    <div className="flex flex-col xl:flex-row items-center xl:items-start gap-8 w-full mx-auto select-none p-1">
      
      {/* LEFT COLUMN ELEMENT: ASSIGNED 42% LAYOUT WIDTH */}
      <div className="w-full xl:w-[42%] flex flex-col items-center justify-center flex-shrink-0 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            style={{ transformStyle: "preserve-3d" }}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="relative w-80 h-[620px] rounded-[48px] border-4 border-gray-800 bg-gradient-to-b from-gray-950 to-black shadow-[0_0_40px_rgba(99,102,241,0.2)] overflow-hidden"
          >
            {/* FRONT VIEW */}
            {viewMode === "front" && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-2 rounded-[40px] bg-gradient-to-b from-indigo-600 via-purple-700 to-black"
                />
                <div className="absolute top-28 left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute bottom-32 right-8 w-28 h-28 rounded-full bg-cyan-400/10 blur-xl" />
                <div className="absolute top-20 left-0 right-0 text-center">
                  <p className="text-white text-4xl font-light">09:41</p>
                </div>
                <div className="absolute top-10 right-6 text-green-400 text-xs">100%</div>
              </>
            )}

            {/* BACK VIEW */}
            {viewMode === "back" && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`absolute inset-0 bg-gradient-to-b ${bodyStyles[bodyTheme]}`}
                />
                <div className={`absolute inset-0 opacity-20 blur-xl ${bodyTheme === "gaming" ? "bg-red-500" : bodyTheme === "eco" ? "bg-green-500" : bodyTheme === "camera" ? "bg-yellow-400" : bodyTheme === "budget" ? "bg-blue-500" : "bg-gray-400"}`} />
                <div className="absolute top-10 left-6 p-3 rounded-3xl bg-gray-900 border border-indigo-400/30">
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3].map((lens) => (
                      <div key={lens} className="w-10 h-10 rounded-full bg-black border-2 border-cyan-400/40" />
                    ))}
                    <div className="w-10 h-10 rounded-full bg-yellow-200/20" />
                  </div>
                </div>
                <div className="absolute top-[45%] left-0 right-0 text-center">
                  <p className="text-indigo-400 text-2xl font-bold tracking-widest">
                    {bodyTheme === "gaming" && "FORGE-X"}
                    {bodyTheme === "eco" && "FORGE ECO"}
                    {bodyTheme === "premium" && "FORGE PRO"}
                    {bodyTheme === "budget" && "FORGE CORE"}
                    {bodyTheme === "camera" && "FORGE CAM"}
                  </p>
                </div>
              </>
            )}

            {/* X-RAY VIEW: ORIGINAL DESIGN STAYS INTENSIVELY COMPATIBLE */}
            {viewMode === "xray" && (
              <>
                {/* Dynamic Camera Cutout Accent */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-full z-30 border border-white/5 shadow-inner" />

                {/* Micro Circuit Grid Background */}
                <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(rgba(99,102,241,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.15)_1px,transparent_1px)] bg-[size:16px_16px]" />

                {/* SVG Circuit System Infrastructure */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  {/* CPU to Memory Rails */}
                  <path d="M 120 150 L 210 150" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1.5" fill="none" />
                  {/* CPU to Camera Array Link */}
                  <path d="M 90 120 L 55 120" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1.5" fill="none" />
                  {/* Main Power Bus System */}
                  <motion.path
                    d="M 130 180 L 130 380"
                    stroke={config.battery ? "#22c55e" : "#374151"}
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="6, 6"
                    animate={{ strokeDashoffset: [-20, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Storage Bus Routing */}
                  <path d="M 170 180 L 170 240 L 210 240" stroke="rgba(234, 179, 8, 0.3)" strokeWidth="1.5" fill="none" />
                </svg>

                {/* SENSORS CLUSTER ASSEMBLY */}
                <div className="absolute top-12 right-8 flex gap-1 z-20">
                  {config.sensors?.length > 0 ? (
                    config.sensors.slice(0, 4).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                      />
                    ))
                  ) : (
                    <div className="w-16 h-3 rounded-full border border-dashed border-gray-800 bg-gray-950/40 text-[8px] flex items-center justify-center text-gray-600">SNS_EMPTY</div>
                  )}
                </div>

                {/* PROCESSOR UNIT (CPU) */}
                <div className="absolute top-24 left-20 w-24 h-24 rounded-2xl border border-blue-500/20 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-20">
                  {config.processor ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center text-center p-1 shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400/30"
                    >
                      <span className="text-[10px] uppercase font-black tracking-wider text-blue-200">SoC Core</span>
                      <span className="text-[9px] font-medium text-white truncate max-w-full px-0.5">{config.processor.name || "CPU"}</span>
                    </motion.div>
                  ) : (
                    <span className="text-[10px] font-bold tracking-widest text-blue-500/30">CPU_SLOT</span>
                  )}
                </div>

                {/* MEMORY BANK SYSTEM (RAM) */}
                <div className="absolute top-24 right-6 w-12 h-24 rounded-xl border border-purple-500/20 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-20">
                  {config.ram ? (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="w-9 h-[84px] rounded-lg bg-gradient-to-b from-purple-600 to-purple-800 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-400/30"
                    >
                      <span className="text-[9px] font-black text-purple-100 rotate-90 my-2">RAM</span>
                      <span className="text-[9px] font-bold text-white mt-1">{config.ram.size}GB</span>
                    </motion.div>
                  ) : (
                    <span className="text-[9px] font-bold text-purple-500/30 tracking-wider rotate-90">RAM_VOID</span>
                  )}
                </div>

                {/* FLASH STORAGE SYSTEM (SSD) */}
                <div className="absolute top-52 right-6 w-16 h-10 rounded-xl border border-yellow-500/20 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-20">
                  {config.storage ? (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-[54px] h-[30px] rounded-lg bg-gradient-to-r from-yellow-600 to-amber-600 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.4)] border border-yellow-400/30"
                    >
                      <span className="text-[8px] font-black text-yellow-100">NAND FLASH</span>
                      <span className="text-[9px] font-bold text-white">{config.storage.capacity}GB</span>
                    </motion.div>
                  ) : (
                    <span className="text-[8px] font-bold text-yellow-500/30 tracking-widest">STORAGE</span>
                  )}
                </div>

                {/* THERMAL dissipator MODULE */}
                {config.thermal && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    className="absolute top-52 left-6 w-8 h-32 rounded-xl bg-gradient-to-b from-cyan-600/30 to-blue-600/10 border border-cyan-400/30 backdrop-blur-xs flex items-center justify-center z-10"
                  >
                    <span className="text-[8px] font-bold text-cyan-400/50 tracking-widest -rotate-90 whitespace-nowrap">COOLING CELL</span>
                  </motion.div>
                )}

                {/* BATTERY ENERGY ENGINE */}
                <div className="absolute bottom-16 left-6 right-6 h-40 rounded-2xl border border-green-500/20 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-20">
                  {config.battery?.isValid ? (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-[254px] h-[148px] rounded-xl bg-gradient-to-br from-green-600/20 via-green-900/40 to-black/80 border border-green-500/80 p-3 relative flex flex-col justify-between shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[10px] font-black tracking-widest text-green-400">LI-ION POWER MATRIX</span>
                        <div className="w-2 h-4 bg-green-500 rounded-xs" />
                      </div>
                      <div className="text-center my-auto">
                        <p className="text-2xl font-black tracking-tight text-white">{config.battery?.capacity}</p>
                        <p className="text-[9px] uppercase tracking-widest text-green-300 font-bold">{config.battery?.chargingSpeed}W SuperCharge Enabled</p>
                      </div>
                    </motion.div>
                  ) : (
                    <span className="text-[10px] font-bold tracking-widest text-green-500/30">BATTERY_TRACK_REQUIRED</span>
                  )}
                </div>

                {/* OPTICAL CAMERA MATRIX */}
                <div className="absolute top-6 left-6 w-12 h-12 rounded-xl border border-indigo-500/20 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center">
                  {config.camera?.isValid && (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="grid grid-cols-2 gap-1 p-0.5">
                      {[1, 2, 3].map((lens) => (
                        <div key={lens} className="w-4 h-4 rounded-full bg-black border border-cyan-400/50 shadow-inner" />
                      ))}
                      <div className="w-4 h-4 rounded-full bg-yellow-400/40 border border-yellow-200/50" />
                    </motion.div>
                  )}
                </div>

                {/* COAXIAL ANTENNA BANDS */}
                {config.connectivity?.isValid && (
                  <>
                    <div className="absolute top-8 left-20 w-24 h-[1px] bg-cyan-500/30 shadow-[0_0_4px_#22d3ee]" />
                    <div className="absolute top-8 right-20 w-16 h-[1px] bg-cyan-500/30 shadow-[0_0_4px_#22d3ee]" />
                  </>
                )}

                {/* TACTILE HAPTIC CORE */}
                {config.haptics && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-4 left-8 w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500/30 to-pink-700/50 border border-pink-400/50 shadow-[0_0_12px_rgba(244,114,182,0.4)] flex items-center justify-center z-20"
                  >
                    <span className="text-[7px] font-black text-pink-200">VIBE</span>
                  </motion.div>
                )}

                

                {/* SCANNING ACTIVE LINE */}
                <AnimatePresence>
                  {isTesting && (
                    <motion.div
                      initial={{ top: "0%" }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] z-40"
                    />
                  )}
                </AnimatePresence>

                {/* REAL-TIME SIMULATION FEEDBACK */}
                <AnimatePresence>
                  {isTesting && scanStage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-20 left-4 right-4 text-center z-50 bg-slate-950/90 py-1.5 px-3 rounded-lg border border-cyan-500/30 backdrop-blur-md"
                    >
                      <p className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase animate-pulse">{scanStage}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {/* BASE BRAND FOOTER */}
            <div className="absolute bottom-4 left-0 right-0 text-center z-20 pointer-events-none">
              <p className="text-[9px] font-mono tracking-widest text-gray-600 uppercase">Assembly Engine v4.0</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* RIGHT COLUMN: HIGH-CONTRAST SYSTEM MANIFEST (SCOREBOARD ALLOCATION FROM IMAGE 3) */}
      <div className="w-full xl:w-[58%] flex flex-col gap-4 flex-grow z-20 xl:mt-1">
        <div className="space-y-0.5 px-1">
          <h3 className="text-[10px] font-mono font-black tracking-[0.25em] text-indigo-400 uppercase">SYSTEM MANIFEST ARCHITECTURE</h3>
          <p className="text-[11px] text-neutral-500 font-medium">Real-time smartphone configuration allocation trace maps.</p>
        </div>

        {/* COMPONENT DESCRIPTIVE ROWS LIST */}
        <div className="space-y-2.5 w-full">
          {[
            { label: "Processor Unit", title: chipName,  color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { label: "Memory Framework", title: ramDetails,  color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
            { label: "Storage Architecture", title: storageDetails,  color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
            { label: "Display Core Engineering", title: displayDetails, desc: displayHz, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
            { label: "Energy Matrix Cell", title: batteryCapacity, desc: batterySpeed, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
            { label: "Tactile Haptics Module", title: hapticMotorName, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" }
          ].map((item, i) => (
            <div 
              key={i} 
              className={`p-3.5 rounded-xl bg-gradient-to-r from-neutral-900/40 to-[#080d15]/90 border ${item.border} flex items-center gap-4 shadow-xl transition-all duration-300 group relative w-full`}
            >
              <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center text-xs font-mono font-bold ${item.color} border border-white/5 flex-shrink-0`}>
                {i + 1}
              </div>
              
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center justify-between w-full">
                  <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-500 uppercase truncate">{item.label}</span>
                  <span className="text-[8px] font-mono text-neutral-600 flex-shrink-0">ALLOCATION_OK</span>
                </div>
                <p className="text-sm font-bold text-neutral-100 truncate mt-0.5">{item.title}</p>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5 truncate">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM REAL-TIME HUD SIMULATION SCORE SUMMARY ROW */}
        <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-900 font-mono text-[11px] shadow-2xl flex justify-between gap-3 items-center w-full flex-wrap">
          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_#3b82f6]" /> <span className="text-neutral-500">PERFORMANCE:</span> <span className="text-neutral-300 font-bold">{metrics?.performance || 0}</span></div>
          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_6px_#eab308]" /> <span className="text-neutral-500">THERMAL:</span> <span className="text-neutral-300 font-bold">{metrics?.thermal || 0}</span></div>
          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#22c55e]" /> <span className="text-neutral-500">POWER:</span> <span className="text-neutral-300 font-bold">{metrics?.battery || 0}</span></div>
          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#a855f7]" /> <span className="text-neutral-500">INTEGRITY:</span> <span className="text-neutral-300 font-bold">{metrics?.buildQuality || 0}</span></div>
        </div>
      </div>

    </div>
  );
};

export default PhoneRender;