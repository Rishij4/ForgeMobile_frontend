// ResetPassword.jsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import API from "../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [isResetDone, setIsResetDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successful");
      setTimeout(() => { setIsResetDone(true); }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative antialiased selection:bg-indigo-500/30">
      <div className="w-full max-w-md bg-black/40 backdrop-blur-md p-6 sm:p-10 rounded-2xl border border-indigo-600/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-80" />

        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200 outline-none">
          <span>←</span> Back
        </Link>

        <h1 className="text-2xl sm:text-4xl font-black text-white mt-6 mb-8 tracking-tight">Reset Password</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="password" placeholder="New Password" disabled={isResetDone} value={password} onChange={(e) => setPassword(e.target.value)}
              className={`w-full border focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all font-medium placeholder-gray-600 ${
                isResetDone ? "bg-gray-800 text-gray-500 cursor-not-allowed border-gray-800/50" : "bg-black border-gray-800"
              }`}
            />
          </div>

          {!isResetDone ? (
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg transform transition-all duration-200 active:scale-[0.98] uppercase mt-2">
              Reset Password
            </button>
          ) : (
            <Link to="/login" className="w-full bg-green-600 hover:bg-green-500 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg transform transition-all duration-200 active:scale-[0.98] block text-center uppercase mt-2">
              Back to Login
            </Link>
          )}

          {isResetDone && (
            <p className="text-green-400 text-xs sm:text-sm font-semibold mt-4 text-center tracking-wide leading-relaxed animate-pulse">
              Password updated successfully. Please login again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;