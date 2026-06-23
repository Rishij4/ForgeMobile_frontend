// SensorSelector.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const SensorSelector = ({ config, setConfig }) => {
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/sensors");
        setSensors(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const toggleSensor = (sensorObject) => {
    const current = config.sensors || [];
    const exists = current.some(s => s._id === sensorObject._id);
    const updated = exists ? current.filter(s => s._id !== sensorObject._id) : [...current, sensorObject];
    setConfig(prev => ({ ...prev, sensors: updated }));
  };

  return (
    <div className="bg-[#111827]/40 backdrop-blur-md border border-indigo-600/50 rounded-2xl shadow-xl p-5 sm:p-6 mb-5 transition-all duration-300 hover:border-indigo-500">
      {/* HEADER SECTION ROW */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/40">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Sensor Array</h3>
        <button
          onClick={() => setConfig(prev => ({ ...prev, sensors: [] }))}
          className="bg-transparent border-none text-red-400 hover:text-red-300 transition-colors font-semibold text-xs sm:text-sm cursor-pointer tracking-wide uppercase"
        >
          Clear All
        </button>
      </div>

      <div className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed font-medium">
        Select onboard sensors for environmental awareness and motion tracking.
        <div className="text-indigo-400 text-xs font-semibold mt-1.5 font-mono">Selected Sensors: {config.sensors?.length || 0}</div>
      </div>

      {/* GRID CHECKBOX TOGGLES BOX CONTAINER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
        {sensors.map((sensor) => {
          const isSelected = config.sensors?.some(item => item._id === sensor._id) || false;
          return (
            <label
              key={sensor._id}
              className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 text-sm font-semibold select-none text-white ${
                isSelected
                  ? "border-indigo-500 bg-indigo-950/40 shadow-md shadow-indigo-500/5 text-indigo-200"
                  : "border-gray-800 bg-black hover:bg-white/[0.01] hover:border-gray-750"
              }`}
            >
              <input
                type="checkbox" checked={isSelected} onChange={() => toggleSensor(sensor)}
                className="w-4 h-4 rounded border-gray-700 bg-black accent-indigo-500 text-indigo-600 focus:ring-indigo-500/40 cursor-pointer shrink-0"
              />
              <span className="truncate flex-1">{sensor.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default SensorSelector;