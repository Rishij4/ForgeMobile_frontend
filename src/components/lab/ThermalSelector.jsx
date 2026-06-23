// ThermalSelector.jsx
import React, { useEffect, useState } from "react";
import API from "../../services/api";

const ThermalSelector = ({ config, setConfig }) => {
  const [thermals, setThermals] = useState([]);
  const [selectedThermal, setSelectedThermal] = useState("");

  useEffect(() => {
    const fetchThermals = async () => {
      const response = await API.get("/compatibility/thermals");
      setThermals(response.data);
    };
    fetchThermals();
  }, []);

  // restore selected value when loading/editing
  useEffect(() => {
  if (
    config?.thermal?._id &&
    config.thermal._id !== selectedThermal
  ) {
    setSelectedThermal(config.thermal._id);
  }
}, [config?.thermal]);

  useEffect(() => {
  if (!selectedThermal) return;

  const thermal = thermals.find(
    item => item._id === selectedThermal
  );

  if (thermal) {
    setConfig(prev => ({
      ...prev,
      thermal: thermal
    }));
  }
}, [selectedThermal, thermals]);

  return (
    <div className="bg-[#111827]/40 backdrop-blur-md border border-indigo-600/50 rounded-2xl shadow-xl p-5 sm:p-6 mb-5">

      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/40">
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          Thermal System
        </h3>
      </div>

      <div className="text-xs sm:text-sm text-gray-400 mb-6">
        Configure cooling solution for heat management.
      </div>

      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
        Cooling Type
      </label>

      <select
        className="w-full bg-black border border-gray-800 rounded-xl p-3.5 text-sm text-white"
        value={selectedThermal}
        onChange={(e) => setSelectedThermal(e.target.value)}
      >
        <option value="">Choose Cooling System</option>

        {thermals.map(item => (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThermalSelector;