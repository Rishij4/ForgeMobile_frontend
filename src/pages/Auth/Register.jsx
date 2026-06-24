// Register.jsx
import React, { useState } from "react";
import { registerUser } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await registerUser({
        username,
        email,
        password
      });

      toast.success(
        "Registered successfully. Login to your Account"
      );

      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Registration failed"
      );
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative antialiased selection:bg-indigo-500/30">
      
      {/* NAVIGATION RETURN BACK TRIGGERS */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm font-medium outline-none"
      >
        <span>←</span> Back
      </button>

      {/* CORE DISPLAY FORM CARD BLOCK */}
      <div className="w-full max-w-md bg-black/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-indigo-600/50 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Top Accent Identification Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-80" />

        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
          Create Account
        </h2>

        <p className="text-gray-400 mb-8 text-sm sm:text-base font-medium">
          Start building your custom phone.
        </p>

        {/* INTERACTIVE FORM FIELDS CONTENT */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all font-medium placeholder-gray-600"
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all font-medium placeholder-gray-600"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-white outline-none transition-all font-medium placeholder-gray-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg transform transition-all duration-200 active:scale-[0.98] uppercase mt-2"
          >
            Register
          </button>
        </form>

        {/* BOTTOM REDIRECT FRAME FOOTER ROUTING */}
        <p className="text-gray-400 mt-6 text-center text-sm font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 transition-colors font-bold ml-0.5"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
