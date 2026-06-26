// ResetPassword.jsx
import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import API from "../services/api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

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

      toast.success("Password updated successfully");

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
    <div className="min-h-screen bg-black flex items-center justify-center px-6 overflow-hidden relative antialiased selection:bg-indigo-500/30">
      
      {/* 2. Motion applied strictly to the card for a sleek, hardware-accelerated slide-in */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} // Switched to 'y' axis for a cleaner modern lift, or use x: 30
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.16, 1, 0.3, 1] // Custom ultra-smooth easeOutExpo curve
        }}
        className="w-full max-w-md bg-black/40 p-8 rounded-2xl border border-indigo-600/50 backdrop-blur-sm relative"
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
          {/* Password Input Group Wrapper */}
          <div className="relative mb-5">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full bg-black border border-gray-800 rounded-xl p-3 pr-12 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-gray-600 font-medium text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 transition-colors focus:outline-none p-1 rounded-md disabled:opacity-30"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                /* EYE SLASH ICON (HIDE) */
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                /* EYE ICON (SHOW) */
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {/* 3. Added a subtle scale-down tap effect for better button micro-interactions */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition-colors text-white py-3 rounded-xl font-bold text-sm tracking-wide shadow-lg transform uppercase disabled:opacity-50"
          >
            {loading ? "Updating..." : "Reset Password"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
