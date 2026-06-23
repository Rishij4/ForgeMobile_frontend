// BatterySelector.jsx
import React, { useEffect, useState, useMemo } from "react";
import API from "../../services/api";

const BatterySelector = ({ config, setConfig }) => {
  const [batteries, setBatteries] = useState([]);
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [customCapacity, setCustomCapacity] = useState("");
  const [selectedChargingSpeed, setSelectedChargingSpeed] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [batteryError, setBatteryError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await API.get("/batteries");
        setBatteries(response.data);
      } catch (error) {
        console.error("Failed to fetch batteries", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (config?.battery && batteries.length) {
      if (config.battery.capacity) {
        const exists = batteries.some(item => item.capacity === config.battery.capacity);
        setSelectedCapacity(exists ? String(config.battery.capacity) : "");
        setCustomCapacity(exists ? "" : String(config.battery.capacity));
      }
      setSelectedChargingSpeed(String(config.battery.chargingSpeed || ""));
      setSelectedType(config.battery.type || ""); 
    }
  }, [config?.battery, batteries]);

  const uniqueCapacities = useMemo(() => [...new Set(batteries.map(b => b.capacity))].sort((a, b) => a - b), [batteries]);
  const uniqueChargingSpeeds = useMemo(() => [...new Set(batteries.map(b => b.chargingSpeed))].sort((a, b) => a - b), [batteries]);
  const uniqueTypes = useMemo(() => [...new Set(batteries.map(b => b.type))], [batteries]);

  useEffect(() => {
    if (!batteries.length) return;
    if (config?.battery?.isValid && !selectedCapacity && !customCapacity && !selectedChargingSpeed && !selectedType) return;

    const capacity = customCapacity !== "" ? Number(customCapacity) : Number(selectedCapacity);
    if (!capacity || !selectedChargingSpeed || !selectedType) return;

    const selectedBattery = batteries.find(b => b.capacity === capacity && b.chargingSpeed === Number(selectedChargingSpeed) && b.type === selectedType);
    const newBattery = selectedBattery || { capacity, chargingSpeed: Number(selectedChargingSpeed), type: selectedType, batteryScore: 0, price: 0 };

    setConfig(prev => ({ ...prev, battery: { ...newBattery, isValid: true } }));
  }, [selectedCapacity, customCapacity, selectedChargingSpeed, selectedType, batteries]);

  return (
    <div className="bg-[#111827]/40 backdrop-blur-md border border-indigo-600/50 rounded-2xl shadow-xl p-5 sm:p-6 mb-5 transition-all duration-300 hover:border-indigo-500">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/40">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Battery System</h3>
      </div>
      <div className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed font-medium">Configure battery capacity, charging speed, and battery chemistry.</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Battery Size</label>
          <select
            className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            value={selectedCapacity} disabled={customCapacity !== ""}
            onChange={(e) => { setSelectedCapacity(e.target.value); if (e.target.value !== "") { setCustomCapacity(""); setBatteryError(""); } }}
          >
            <option value="" className="bg-[#000000] text-white">Choose Battery Size</option>
            {uniqueCapacities.map(cap => <option key={cap} value={cap} className="bg-[#000000] text-white py-2">{cap} mAh</option>)}
          </select>
        </div>

        <div className="w-full">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Custom Capacity (mAh)</label>
          <input
            type="text" placeholder="1000 - 10000" value={customCapacity} disabled={selectedCapacity !== ""}
            className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-600"
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^\d+$/.test(val)) {
                setCustomCapacity(val);
                if (val === "") { setBatteryError(""); return; }
                const num = Number(val);
                if (num < 1000) setBatteryError("Battery size must be at least 1000 mAh");
                else if (num > 10000) setBatteryError("Battery size cannot exceed 10000 mAh");
                else setBatteryError("");
              }
            }}
          />
          {batteryError && <p className="text-[#ef4444] mt-2 text-xs font-semibold tracking-wide animate-pulse">{batteryError}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Charging Wattage</label>
          <select
            className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium"
            value={selectedChargingSpeed} onChange={(e) => setSelectedChargingSpeed(e.target.value)}
          >
            <option value="" className="bg-[#000000] text-white">Choose Wattage</option>
            {uniqueChargingSpeeds.map(watt => <option key={watt} value={watt} className="bg-[#000000] text-white py-2">{watt} W</option>)}
          </select>
        </div>

        <div className="w-full">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Battery Type</label>
          <select
            className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium"
            value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="" className="bg-[#000000] text-white">Choose Battery Type</option>
            {uniqueTypes.map(type => <option key={type} value={type} className="bg-[#000000] text-white py-2">{type}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default BatterySelector;