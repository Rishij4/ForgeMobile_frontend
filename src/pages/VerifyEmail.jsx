// VerifyEmail.jsx
import { useEffect, useRef } from "react";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!hasVerified.current) {
      hasVerified.current = true;
      verify();
    }
  }, []);

  const verify = async () => {
    try {
      const res = await API.get(`/auth/verify-email/${token}`)

      toast.success("Email verified successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      alert("Invalid or expired link");
      // go back register page
      navigate("/register");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative antialiased selection:bg-indigo-500/30">
      
      {/* CORE AUTOMATIC ACTIVATION TRACE LAYOUT PANORAMA CARD */}
      <div className="w-full max-w-md bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-indigo-600/50 shadow-2xl relative overflow-hidden text-center flex flex-col items-center justify-center gap-4">
        
        {/* Decorative Top Accent Identification Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-80" />

        {/* Dynamic Theme Loading Target Tracker Spinner Node */}
        <div className="w-9 h-9 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2" />

        <div className="text-lg sm:text-xl font-bold tracking-tight text-white">
          Verifying Email...
        </div>

        <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-xs leading-relaxed">
          Please wait while our hardware core authenticates your verification signature tokens.
        </p>

      </div>
    </div>
  );
};

export default VerifyEmail;
