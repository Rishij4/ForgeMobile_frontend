// StorageSelector.jsx
import React, { useEffect, useState, useMemo } from "react";
import API from "../../services/api";

const StorageSelector = ({ config, setConfig }) => {
  const [storages, setStorages] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await API.get("/compatibility/storages");
        setStorages(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (config?.storage?.type) setSelectedType(config.storage.type);
  }, [config?.storage]);

  const uniqueTypes = useMemo(() => [...new Set(storages.map(item => item.type))], [storages]);
  const filteredSizes = storages.filter(item => item.type === selectedType);

  return (
    <div className="bg-[#111827]/40 backdrop-blur-md border border-indigo-600/50 rounded-2xl shadow-xl p-5 sm:p-6 mb-5 transition-all duration-300 hover:border-indigo-500">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/40">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Storage System</h3>
      </div>
      <div className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed font-medium">Select storage technology and capacity for your device.</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* STORAGE TYPE */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Storage Type</label>
          <select
            value={selectedType}
            onChange={(e) => { setSelectedType(e.target.value); setConfig(prev => ({ ...prev, storage: null })); }}
            className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium"
          >
            <option value="" className="bg-[#000000] text-white">Choose Storage Type</option>
            {uniqueTypes.map(type => <option key={type} value={type} className="bg-[#000000] text-white py-2">{type}</option>)}
          </select>
        </div>

        {/* STORAGE CAPACITY */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Storage Capacity</label>
          <select
            value={config.storage?._id || ""}
            disabled={!selectedType}
            onChange={(e) => setConfig(prev => ({ ...prev, storage: storages.find(item => item._id === e.target.value) }))}
            className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="" className="bg-[#000000] text-white">Choose Storage Size</option>
            {filteredSizes.map(item => (
              <option key={item._id} value={item._id} className="bg-[#000000] text-white py-2">
                {item.capacity >= 1024 ? `${item.capacity / 1024} TB` : `${item.capacity} GB`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StorageSelector;