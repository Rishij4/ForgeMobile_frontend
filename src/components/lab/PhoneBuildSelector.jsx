import React, { useEffect, useState } from "react";
import API from "../../services/api";

const PhoneBuildSelector = ({ config, setConfig }) => {
  const [builds, setBuilds] = useState([]);
  const [selectedBuild, setSelectedBuild] = useState("");

  useEffect(() => {
    const fetchBuilds = async () => {
      const response = await API.get("/compatibility/phonebuilds");
      setBuilds(response.data);
    };
    fetchBuilds();
  }, []);

  // restore on edit/load
  useEffect(() => {
  if (
    config?.phoneBuild?._id &&
    config.phoneBuild._id !== selectedBuild
  ) {
    setSelectedBuild(config.phoneBuild._id);
  }
}, [config?.phoneBuild]);

  useEffect(() => {
  if (!selectedBuild) return;

  const build = builds.find(
    item => item._id === selectedBuild
  );

  if (build) {
    setConfig(prev => ({
      ...prev,
      phoneBuild: build
    }));
  }
}, [selectedBuild, builds]);

  return (
    <div className="bg-[#111827]/40 backdrop-blur-md border border-indigo-600/50 rounded-2xl shadow-xl p-5 sm:p-6 mb-5">

      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/40">
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          Device Build
        </h3>
      </div>

      <div className="text-xs sm:text-sm text-gray-400 mb-6">
        Select body material and frame construction.
      </div>

      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
        Build Material
      </label>

      <select
        className="w-full bg-black border border-gray-800 rounded-xl p-3.5 text-sm text-white"
        value={selectedBuild}
        onChange={(e) => setSelectedBuild(e.target.value)}
      >
        <option value="">Choose Material</option>

        {builds.map(item => (
          <option key={item._id} value={item._id}>
            {item.material}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PhoneBuildSelector;