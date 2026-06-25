import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/admin-login", {
        email,
        password
      });

      sessionStorage.setItem(
        "adminToken",
        res.data.token
      );

      toast.success("Admin login successful");

      navigate("/admin/dashboard");

    } catch {
      toast.error("Invalid admin credentials");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-zinc-900 border border-indigo-500 rounded-2xl p-8 shadow-2xl">

        <h1 className="text-3xl font-bold text-white mb-2">
          Admin Panel
        </h1>

        <p className="text-gray-400 mb-8">
          Login as administrator
        </p>

        <form
          onSubmit={handleAdminLogin}
          className="space-y-5"
        >

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition"
          >
            ADMIN LOGIN
          </button>

        </form>

      </div>

    </div>
  );
};

export default AdminLogin;
