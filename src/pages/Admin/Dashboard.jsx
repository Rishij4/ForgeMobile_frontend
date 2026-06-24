// Dashboard.jsx
import { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBuilds: 0
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const statsRes = await API.get(
        "/admin-dashboard/stats"
      );

      const usersRes = await API.get(
        "/admin-dashboard/users"
      );

      setStats(statsRes.data);
      setUsers(usersRes.data);

    } catch {
      toast.error("Failed loading dashboard");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete user permanently?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(
        `/admin-dashboard/users/${id}`
      );

      toast.success("User deleted");

      fetchDashboard();

    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-4xl font-bold mb-8">
        ForgeMobile Admin
      </h1>

      {/* Stats */}

      <div className="grid grid-cols-2 gap-6 mb-10">

        <div className="bg-zinc-900 p-6 rounded-xl border border-indigo-500">
          <h2 className="text-lg">
            Registered Users
          </h2>

          <p className="text-3xl mt-3">
            {stats.totalUsers}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl border border-indigo-500">
          <h2 className="text-lg">
            Saved Builds
          </h2>

          <p className="text-3xl mt-3">
            {stats.totalBuilds}
          </p>
        </div>

      </div>


      {/* Users Table */}

      <div className="bg-zinc-900 rounded-xl p-5">

        <h2 className="text-xl mb-5">
          Manage Users
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b border-zinc-700">

              <th className="p-3 text-left">
                Username
              </th>

              <th className="text-left">
                Email
              </th>

              <th>
                Builds
              </th>

              <th>
                Delete
              </th>

            </tr>

          </thead>


          <tbody>

            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-zinc-800"
              >

                <td className="p-4">
                  {user.username}
                </td>

                <td>
                  {user.email}
                </td>

                <td className="text-center">
                  {user.buildCount}
                </td>

                <td className="text-center">

                  <button
                    onClick={() =>
                      handleDelete(user._id)
                    }
                    className="bg-red-600 px-4 py-2 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Dashboard;
