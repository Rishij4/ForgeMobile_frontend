// HapticsSelector.jsx
import { useEffect, useState } from "react";
import API from "../../services/api";

const HapticsSelector = ({
  config,
  setConfig
}) => {

  const [haptics, setHaptics] = useState([]);

  useEffect(() => {
    const fetchHaptics = async () => {
      try {
        const response = await
          API.get("/haptics")

        setHaptics(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHaptics();
  }, []);

  return (
    <div className="bg-[#111827]/40 backdrop-blur-md border border-indigo-600/50 rounded-2xl shadow-xl p-5 sm:p-6 mb-5 transition-all duration-300 hover:border-indigo-500">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/40">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Haptic Engine
        </h3>
      </div>

      <div className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed font-medium">
        Configure vibration motor and tactile feedback experience for your device.
      </div>

      {/* FORM INPUT FIELD */}
      <div className="w-full">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Select Haptic Motor
        </label>

        <select
          value={config.haptics?._id || ""}
          onChange={(e) => {
            const selected = haptics.find(
              item => item._id === e.target.value
            );

            setConfig(prev => ({
              ...prev,
              haptics: selected
            }));
          }}
          className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium"
        >
          <option value="" className="bg-[#000000] text-white">Select Haptics</option>
          {haptics.map(item => (
            <option key={item._id} value={item._id} className="bg-[#000000] text-white py-2">
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* CONDITIONAL SPECIFICATION NOTIFICATION BOX */}
      {config.haptics && (
        <div className="mt-4 p-4 bg-black/40 border border-gray-800 rounded-xl text-sm font-medium text-gray-200 flex gap-1.5 items-center">
          <span className="text-indigo-400 font-bold uppercase tracking-wide text-xs select-none">
            Selected:
          </span>{" "}
          <span className="text-white">{config.haptics.name}</span>
        </div>
      )}

    </div>
  );
};

export default HapticsSelector;
