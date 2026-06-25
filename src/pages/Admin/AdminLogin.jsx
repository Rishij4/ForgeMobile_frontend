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

      sessionStorage.setItem("adminToken", res.data.token);

      toast.success("Admin login successful");

      navigate("/admin/dashboard");

    } catch {
      toast.error("Invalid admin credentials");
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>

      <form onSubmit={handleAdminLogin}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin Email"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button>Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;