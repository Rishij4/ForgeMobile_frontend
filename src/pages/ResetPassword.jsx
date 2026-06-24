import { useState } from "react";
import {
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom";

import { toast } from "react-hot-toast";
import API from "../services/api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");

  const location = useLocation();

  const navigate = useNavigate();

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/reset-password", {
        email,
        password,
      });

      toast.success("Password updated");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Reset failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-black/40 p-8 rounded-2xl border border-indigo-600/50">

        <Link to="/login" className="text-gray-400">
          ← Back
        </Link>

        <h1 className="text-3xl text-white mt-6 mb-8">
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
            className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white mb-5"
          />

          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl">
            Reset Password
          </button>

        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
