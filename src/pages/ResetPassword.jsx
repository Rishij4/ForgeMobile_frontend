import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import API from "../services/api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/auth/reset-password", {
        email,
        password,
      });

      toast.success("Password updated successfully ✓");

      // wait so toast is visible
      setTimeout(() => {
        navigate("/login");
      }, 2200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. Static outer container prevents screen flickering and scrollbar glitches
    <div className="min-h-screen bg-black flex items-center justify-center px-6 overflow-hidden">
      
      {/* 2. Motion applied strictly to the card for a sleek, hardware-accelerated slide-in */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} // Switched to 'y' axis for a cleaner modern lift, or use x: 30
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.16, 1, 0.3, 1] // Custom ultra-smooth easeOutExpo curve
        }}
        className="w-full max-w-md bg-black/40 p-8 rounded-2xl border border-indigo-600/50 backdrop-blur-sm"
      >
        <Link
          to="/login"
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          ← Back
        </Link>

        <h1 className="text-3xl text-white mt-6 mb-8 font-bold tracking-tight">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white mb-5 focus:outline-none focus:border-indigo-500 transition-colors"
          />

          {/* 3. Added a subtle scale-down tap effect for better button micro-interactions */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition-colors text-white py-3 rounded-xl font-medium disabled:opacity-50"
          >
            {loading ? "Updating..." : "Reset Password"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
