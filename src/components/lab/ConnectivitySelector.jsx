// ConnectivitySelector.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const ConnectivitySelector = ({ config, setConfig }) => {
  const [networks, setNetworks] = useState([]);
  const [wifis, setWifis] = useState([]);
  const [bluetooths, setBluetooths] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/connectivity");
        setNetworks(response.data.networks);
        setWifis(response.data.wifis);
        setBluetooths(response.data.bluetooths);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const updateConnectivity = (updatedFields) => {
    setConfig(prev => {
      const nextConn = { ...(prev.connectivity || {}), ...updatedFields };
      const isValid = nextConn.network && nextConn.wifi && nextConn.bluetooth;
      return { ...prev, connectivity: { ...nextConn, isValid: !!isValid } };
    });
  };

  return (
    <div className="bg-[#111827]/40 backdrop-blur-md border border-indigo-600/50 rounded-2xl shadow-xl p-5 sm:p-6 mb-5 transition-all duration-300 hover:border-indigo-500">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/40">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Connectivity</h3>
      </div>
      <div className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed font-medium">Configure wireless communication capabilities for your device.</div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
        {/* CELLULAR */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cellular Connectivity</label>
          <select
            className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium"
            value={config.connectivity?.network?._id || ""}
            onChange={(e) => updateConnectivity({ network: networks.find(item => item._id === e.target.value) || null })}
          >
            <option value="" className="bg-[#000000] text-white">Select Cellular</option>
            {networks.map(n => <option key={n._id} value={n._id} className="bg-[#000000] text-white py-2">{n.type}</option>)}
          </select>
        </div>

        {/* WIFI */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Wi-Fi</label>
          <select
            className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium"
            value={config.connectivity?.wifi?._id || ""}
            onChange={(e) => updateConnectivity({ wifi: wifis.find(item => item._id === e.target.value) || null })}
          >
            <option value="" className="bg-[#000000] text-white">Select WiFi</option>
            {wifis.map(w => <option key={w._id} value={w._id} className="bg-[#000000] text-white py-2">{w.type}</option>)}
          </select>
        </div>

        {/* BLUETOOTH */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bluetooth</label>
          <select
            className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all cursor-pointer font-medium"
            value={config.connectivity?.bluetooth?._id || ""}
            onChange={(e) => updateConnectivity({ bluetooth: bluetooths.find(item => item._id === e.target.value) || null })}
          >
            <option value="" className="bg-[#000000] text-white">Select Bluetooth</option>
            {bluetooths.map(b => <option key={b._id} value={b._id} className="bg-[#000000] text-white py-2">{b.type}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ConnectivitySelector;