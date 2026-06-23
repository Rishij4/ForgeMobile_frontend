// ProcessorSelector.jsx
import React, { useEffect, useState } from "react";
import API from "../../services/api";

const ProcessorSelector = ({
  config,
  setConfig
}) => {

  const [processors, setProcessors] = useState([]);

  useEffect(() => {
    const fetchProcessors = async () => {
      try {
        const response =
          await API.get(
            "/compatibility/processors"
          );

        setProcessors(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProcessors();
  }, []);

  return (
    <div className="bg-[#111827]/40 backdrop-blur-md border border-indigo-600/50 rounded-2xl shadow-xl p-5 sm:p-6 mb-5 transition-all duration-300 hover:border-indigo-500">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/40">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Processor
        </h3>
      </div>

      <div className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed font-medium">
        Select the chipset that powers your smartphone.
      </div>

      {/* FORM SELECT COMPONENT */}
      <div className="w-full">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Chipset
        </label>

        <select
          value={config.processor?._id || ""}
          onChange={(e) => {
            const selectedProcessor =
              processors.find(
                (item) => item._id === e.target.value
              );

            setConfig(prev => ({
              ...prev,
              processor: selectedProcessor
            }));
          }}
          className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium"
        >
          <option value="" className="bg-[#000000] text-white">Choose Processor</option>
          {processors.map((item) => (
            <option key={item._id} value={item._id} className="bg-[#000000] text-white py-2">
              {item.name}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
};

export default ProcessorSelector;