// ComponentSelector.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const ComponentSelector = ({
  config,
  setConfig
}) => {

  const [components, setComponents] = useState([]);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response =
          await axios.get(
            "http://localhost:5000/api/components"
          );

        setComponents(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchComponents();
  }, []);

  const toggleComponent = (componentObject) => {
    const current = config.components || [];

    const exists =
      current.some(
        component => component._id === componentObject._id
      );

    const updated = exists
      ? current.filter(
          component => component._id !== componentObject._id
        )
      : [
          ...current,
          componentObject
        ];

    setConfig((prev) => ({
      ...prev,
      components: updated
    }));
  };

  return (
    <div className="bg-[#111827]/40 backdrop-blur-md border border-indigo-600/50 rounded-2xl shadow-xl p-5 sm:p-6 mb-5 transition-all duration-300 hover:border-indigo-500">
      
      {/* HEADER SECTION ROW */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/40">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Additional Components
        </h3>

        <button
          onClick={() =>
            setConfig((prev) => ({
              ...prev,
              components: []
            }))
          }
          className="bg-transparent border-none text-red-400 hover:text-red-300 transition-colors font-semibold text-xs sm:text-sm cursor-pointer tracking-wide uppercase"
        >
          Clear All
        </button>
      </div>

      <div className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed font-medium">
        Select additional hardware modules and premium device components.
        <div className="text-indigo-400 text-xs font-semibold mt-1.5 font-mono">
          Selected Components: {config.components?.length || 0}
        </div>
      </div>

      {/* GRID CHECKBOX TOGGLES BOX CONTAINER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
        {components.map((component) => {
          const isSelected =
            config.components?.some(
              item => item._id === component._id
            ) || false;

          return (
            <label
              key={component._id}
              className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 text-sm font-semibold select-none text-white ${
                isSelected
                  ? "border-indigo-500 bg-indigo-950/40 shadow-md shadow-indigo-500/5 text-indigo-200"
                  : "border-gray-800 bg-black hover:bg-white/[0.01] hover:border-gray-750"
              }`}
            >
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-700 bg-black accent-indigo-500 text-indigo-600 focus:ring-indigo-500/40 cursor-pointer shrink-0"
                checked={isSelected}
                onChange={() => toggleComponent(component)}
              />
              <span className="truncate flex-1">{component.name}</span>
            </label>
          );
        })}
      </div>

    </div>
  );
};

export default ComponentSelector;