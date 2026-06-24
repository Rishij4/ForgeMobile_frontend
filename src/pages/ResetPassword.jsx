import { useState } from "react";
import {
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom";

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
      toast.error(
        error.response?.data?.message || "Reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="min-h-screen bg-black flex items-center justify-center px-6"
    >
      <div className="w-full max-w-md bg-black/40 p-8 rounded-2xl border border-indigo-600/50">

        <Link
          to="/login"
          className="text-gray-400 hover:text-white transition"
        >
          ← Back
        </Link>

        <h1 className="text-3xl text-white mt-6 mb-8 font-bold">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit}>

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            disabled={loading}
            className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white mb-5"
          />

          <button
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition text-white py-3 rounded-xl"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>

        </form>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
