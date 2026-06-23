// ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import API from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/forgot-password", { email });
      toast.success("Password reset email sent. Check inbox or spam folder.");
      setEmailSent(true);
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send link");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative antialiased selection:bg-indigo-500/30">
      <div className="w-full max-w-md bg-black/40 backdrop-blur-md p-6 sm:p-10 rounded-2xl border border-indigo-600/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-80" />

        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200 outline-none">
          <span>←</span> Back
        </Link>

        <h1 className="text-2xl sm:text-4xl font-black text-white mt-6 mb-2 tracking-tight">Forgot Password</h1>
        <p className="text-gray-400 mb-8 text-sm sm:text-base font-medium">Enter your email.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all font-medium placeholder-gray-600"
            />
          </div>

          <button
            disabled={emailSent}
            className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg transform transition-all duration-200 uppercase mt-2 select-none ${
              emailSent ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-800/50" : "bg-indigo-600 hover:bg-indigo-500 text-white active:scale-[0.98]"
            }`}
          >
            {emailSent ? "Email Sent ✓" : "Send Reset Link"}
          </button>

          {emailSent && (
            <p className="text-green-400 text-xs sm:text-sm font-semibold mt-4 text-center tracking-wide leading-relaxed animate-pulse">
              Check your Gmail inbox. If not found, check Spam folder.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;