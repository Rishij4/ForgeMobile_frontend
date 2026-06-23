// Profile.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfileStats } from "../services/userService";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalBuilds: 0, totalValue: 0 });

  useEffect(() => {
    (async () => {
      try {
        setStats(await getProfileStats());
      } catch (error) {
        console.log("Profile stats error:", error);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-indigo-500/30 px-4 sm:px-8 py-16 flex items-center justify-center relative">
      {/* Navigation Link */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-4 sm:left-8 bg-black border border-gray-800 hover:border-indigo-500 text-gray-400 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-md outline-none flex items-center gap-2"
      >
        <span>←</span> Back to Home
      </button>

      {/* Main Profile Card */}
      <div className="w-full max-w-2xl bg-black/40 backdrop-blur-md border border-indigo-600/50 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden mt-6 sm:mt-0">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-80" />

        {/* Profile Details banner */}
        <div className="flex flex-col sm:flex-row items-center gap-5 mb-10 pb-6 border-b border-gray-900 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-black tracking-tight select-none shadow-lg shadow-indigo-600/20 shrink-0">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="truncate w-full">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white truncate">{user?.username}</h1>
            <p className="text-gray-400 font-medium text-sm sm:text-base truncate mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* Analytics Hub Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-black/50 border border-gray-800 p-5 rounded-xl transition-all duration-200 hover:border-gray-750">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Saved Builds</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.totalBuilds}</h2>
          </div>

          <div className="bg-black/50 border border-gray-800 p-5 rounded-xl transition-all duration-200 hover:border-gray-750">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Build Value</p>
            <h2 className="text-2xl sm:text-3xl font-black text-green-400 font-mono">₹{stats.totalValue.toLocaleString()}</h2>
          </div>
        </div>

        {/* Interaction Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button onClick={() => navigate("/saved-builds")} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg transform transition-all duration-200 active:scale-[0.98] uppercase">
            View Builds
          </button>
          <button onClick={() => { logout(); navigate("/"); }} className="flex-1 bg-red-600/90 hover:bg-red-500 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg transform transition-all duration-200 active:scale-[0.98] uppercase">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;