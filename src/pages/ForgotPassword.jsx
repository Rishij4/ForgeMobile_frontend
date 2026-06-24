import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import API from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/check-email", { email });

      toast.success("Email found");

      navigate("/reset-password", {
        state: { email },
      });

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Email not found"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-black/40 p-8 rounded-2xl border border-indigo-600/50">

        <Link to="/login" className="text-gray-400">
          ← Back
        </Link>

        <h1 className="text-3xl text-white mt-6 mb-3">
          Forgot Password
        </h1>

        <p className="text-gray-400 mb-8">
          Enter your email
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white mb-5"
          />

          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl">
            Continue
          </button>

        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
