// DisplaySelector.jsx
import React, { useEffect, useState, useMemo } from "react";
import API from "../../services/api";

const DisplaySelector = ({ config, setConfig }) => {
  const [displays, setDisplays] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedRefreshRate, setSelectedRefreshRate] = useState("");
  const [selectedResolution, setSelectedResolution] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await API.get("/displays");
        setDisplays(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (config?.display && displays.length) {
      setSelectedType(config.display.panelType || "");
      setSelectedRefreshRate(String(config.display.refreshRate || ""));
      setSelectedResolution(config.display.resolution || "");
      setSelectedSize(String(config.display.size || ""));
    }
  }, [config?.display, displays]);

  // Memoized unique hardware options lists
  const uniqueTypes = useMemo(() => [...new Set(displays.map(i => i.panelType))], [displays]);
  const uniqueRefreshRates = useMemo(() => [...new Set(displays.map(i => i.refreshRate))], [displays]);
  const uniqueResolutions = useMemo(() => [...new Set(displays.map(i => i.resolution))], [displays]);
  const uniqueSizes = useMemo(() => [...new Set(displays.map(i => i.size))], [displays]);

  useEffect(() => {
    if (!displays.length) return;
    if (config?.display?.panelType && !selectedType && !selectedRefreshRate && !selectedResolution && !selectedSize) return;

    const selectedDisplay = displays.find(item => 
      item.panelType === selectedType &&
      item.refreshRate === Number(selectedRefreshRate) &&
      item.resolution === selectedResolution &&
      item.size === Number(selectedSize)
    );

    if (selectedDisplay) {
      setConfig(prev => ({ ...prev, display: { ...selectedDisplay, isValid: true } }));
    }
  }, [selectedType, selectedRefreshRate, selectedResolution, selectedSize, displays]);

  return (
    <div className="bg-[#111827]/40 backdrop-blur-md border border-indigo-600/50 rounded-2xl shadow-xl p-5 sm:p-6 mb-5 transition-all duration-300 hover:border-indigo-500">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/40">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Display System</h3>
      </div>
      <div className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed font-medium">Configure panel type, refresh rate, resolution, and screen size.</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        {/* DISPLAY TYPE */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Display Type</label>
          <select className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="" className="bg-[#000000] text-white">Choose Display Type</option>
            {uniqueTypes.map(type => <option key={type} value={type} className="bg-[#000000] text-white py-2">{type}</option>)}
          </select>
        </div>

        {/* REFRESH RATE */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Refresh Rate</label>
          <select className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium" value={selectedRefreshRate} onChange={(e) => setSelectedRefreshRate(e.target.value)}>
            <option value="" className="bg-[#000000] text-white">Choose Refresh Rate</option>
            {uniqueRefreshRates.map(rate => <option key={rate} value={rate} className="bg-[#000000] text-white py-2">{rate} Hz</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* RESOLUTION */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Resolution</label>
          <select className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium" value={selectedResolution} onChange={(e) => setSelectedResolution(e.target.value)}>
            <option value="" className="bg-[#000000] text-white">Choose Resolution</option>
            {uniqueResolutions.map(res => <option key={res} value={res} className="bg-[#000000] text-white py-2">{res}</option>)}
          </select>
        </div>

        {/* SCREEN SIZE */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Screen Size</label>
          <select className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
            <option value="" className="bg-[#000000] text-white">Choose Display Size</option>
            {uniqueSizes.map(size => <option key={size} value={size} className="bg-[#000000] text-white py-2">{size}"</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default DisplaySelector;