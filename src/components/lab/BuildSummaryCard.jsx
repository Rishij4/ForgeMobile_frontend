// BuildSummaryCard.jsx
import React from "react";
import { motion } from "framer-motion";

const BuildSummaryCard = ({
  buildName, processor, ram, storage, display, battery, camera,
  connectivity, audio, thermal, phoneBuild, haptics, sensors, components, totalPrice,marketPrice
}) => {
  const cameraText = camera?.isValid ? camera.slots.map(s => `${s.mp}MP ${s.type}`).join(" + ") : "Not Selected";

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.06 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  const specsMap = [
    { title: "Processor", value: processor?.name },
    { title: "RAM", value: ram?.size && ram?.type ? `${ram.size}GB ${ram.type}` : null },
    { title: "Storage", value: storage?.capacity && storage?.type ? `${storage.capacity === 1024 ? "1TB": storage.capacity === 2048 ? "2TB": `${storage.capacity}GB`} ${storage.type}`: null },    
    { title: "Display", value: display?.isValid ? `${display.panelType} | ${display.refreshRate}Hz | ${display.resolution} | ${display.size}"` : null },
    { title: "Battery", value: battery?.isValid ? `${battery.capacity}mAh | ${battery.chargingSpeed}W | ${battery.type}` : null },
    { title: "Camera", value: cameraText, raw: true },
    { title: "Connectivity", value: connectivity?.network?.type && connectivity?.wifi?.type && connectivity?.bluetooth?.type ? `${connectivity.network.type} | ${connectivity.wifi.type} | ${connectivity.bluetooth.type}` : null },
    { title: "Audio", value: audio?.speakers && audio?.dolbyAtmos && audio?.hiResAudio ? `${audio.speakers} | ${audio.dolbyAtmos} | ${audio.hiResAudio}` : null },
    { title: "Thermal System", value: thermal?.name },
    { title: "Device Build", value: phoneBuild?.material },
    { title: "Haptics", value: haptics?.name, fullWidth: true }
  ];

  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} variants={containerVariants}
      className="bg-[#111827] border border-indigo-600/60 rounded-[24px] shadow-[0_0_30px_rgba(79,70,229,0.1)] p-5 sm:p-8 mt-8 text-white relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-indigo-500 to-red-500 opacity-80" />

      <h2 className="text-2xl sm:text-3xl font-black mb-1 text-white tracking-tight flex items-center gap-2.5">
        <span className="text-indigo-400 font-mono text-lg select-none">//</span>Build Summary
      </h2>
      <h3 className="text-xl sm:text-2xl font-bold text-indigo-400 mb-8">{buildName || "Untitled Build"}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {specsMap.map((spec, i) => (
          <motion.div
            key={i} variants={itemVariants}
            className={`bg-black/20 p-4 rounded-xl border border-gray-800/60 transition-all hover:border-indigo-500/20 ${spec.fullWidth ? "md:col-span-2" : ""}`}
          >
            <strong className="text-indigo-400 block mb-1">{spec.title}</strong>
            <p className="text-white">{spec.raw ? spec.value : (spec.value || "Not Selected")}</p>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="mt-6 bg-black/20 p-4 rounded-xl border border-gray-800/60 transition-all hover:border-indigo-500/20">
        <strong className="text-indigo-400 block mb-2">Sensors</strong>
        <p className="text-white">{sensors?.length > 0 ? sensors.map(s => s.name).join(", ") : "Not Selected"}</p>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-4 bg-black/20 p-4 rounded-xl border border-gray-800/60 transition-all hover:border-indigo-500/20">
        <strong className="text-indigo-400 block mb-2">Additional Components</strong>
        <p className="text-white">{components?.length > 0 ? components.map(c => c.name).join(", ") : "None"}</p>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-8 bg-green-900/20 border border-green-500 rounded-2xl p-6 shadow-inner">
        <h3 className="text-xl sm:text-2xl font-bold text-green-400 tracking-tight">Estimated Price: ₹{totalPrice?.toLocaleString()}</h3>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="mt-4 bg-blue-900/20 border border-blue-500 rounded-2xl p-6 shadow-inner"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-blue-400 tracking-tight">
          Market Price: ₹{marketPrice ? marketPrice.toLocaleString() : "Run Test For Market Price"}
        </h3>
      </motion.div>
    </motion.div>
  );
};

export default BuildSummaryCard;
