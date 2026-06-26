// Login.jsx
import React, { useState } from "react";
import { loginUser } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({
        email,
        password
      });

      login(data);
      toast.success("Login successful");

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative antialiased selection:bg-indigo-500/30">
      
      {/* NAVIGATION RETURN BACK TRACE */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm font-medium outline-none"
      >
        <span>←</span> Back
      </button>

      {/* CORE DISPLAY FORM CARD BLOCK */}
      <div className="w-full max-w-md bg-black/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-indigo-600/50 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Top Accent Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-80" />

        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
          Welcome Back
        </h2>

        <p className="text-gray-400 mb-8 text-sm sm:text-base font-medium">
          Login to continue building.
        </p>

        {/* INTERACTIVE FORM FIELDS CONTENT */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all font-medium placeholder-gray-600"
              required
            />
          </div>

          {/* Password Input Group Wrapper */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 pr-12 text-sm text-white outline-none transition-all font-medium placeholder-gray-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 transition-colors focus:outline-none p-1 rounded-md"
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0x" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg transform transition-all duration-200 active:scale-[0.98] uppercase"
          >
            Login
          </button>
        </form>

        {/* BOTTOM REDIRECT FRAME FOOTER ROUTING */}
        <p className="text-gray-400 mt-6 text-center text-sm font-medium">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 hover:text-indigo-300 transition-colors font-bold ml-0.5"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
