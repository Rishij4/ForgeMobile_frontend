import { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // For premium entry animations

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBuilds: 0,
  });
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        API.get("/admin-dashboard/stats"),
        API.get("/admin-dashboard/users"),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch {
      toast.error("Failed loading dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete user permanently?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/admin-dashboard/users/${id}`);
      toast.success("User deleted successfully");
      // Optimistically update local state instead of refetching everything
      setUsers(users.filter((user) => user._id !== id));
      setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
    } catch {
      toast.error("Delete failed");
    }
  };

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 p-6 md:p-10 overflow-hidden">
      {/* Background Ambient Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              ForgeMobile Admin
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Real-time platform metrics and system management
            </p>
          </div>
          <button 
            onClick={fetchDashboard}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition text-zinc-300"
          >
            Refresh Data
          </button>
        </div>

        {/* Stats Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        >
          {/* Card 1 */}
          <motion.div 
            variants={itemVariants}
            className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-zinc-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.4)] hover:border-indigo-500/40 transition-colors duration-300 group"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold tracking-wider uppercase text-zinc-400 group-hover:text-zinc-300 transition-colors">
                Registered Users
              </h2>
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-black mt-4 text-white tracking-tight">
              {isLoading ? "..." : stats.totalUsers.toLocaleString()}
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            variants={itemVariants}
            className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-zinc-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.4)] hover:border-violet-500/40 transition-colors duration-300 group"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold tracking-wider uppercase text-zinc-400 group-hover:text-zinc-300 transition-colors">
                Saved Builds
              </h2>
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-black mt-4 text-white tracking-tight">
              {isLoading ? "..." : stats.totalBuilds.toLocaleString()}
            </p>
          </motion.div>
        </motion.div>

        {/* Users Management Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/30 backdrop-blur-md rounded-2xl border border-zinc-800/80 overflow-hidden shadow-2xl"
        >
          <div className="p-6 border-b border-zinc-800 bg-zinc-900/20">
            <h2 className="text-lg font-bold text-white">Manage Users</h2>
            <p className="text-xs text-zinc-500 mt-0.5">View user statistics and control system privileges</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                  <th className="py-4 px-6">Username</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6 text-center">Builds Created</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800/60 text-sm">
                {users.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-zinc-500">
                      No users found in database.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr 
                      key={user._id} 
                      className="hover:bg-zinc-800/30 transition-colors duration-150 group"
                    >
                      <td className="py-4 px-6 font-medium text-zinc-200 group-hover:text-white transition-colors">
                        {user.username}
                      </td>
                      <td className="py-4 px-6 text-zinc-400">
                        {user.email}
                      </td>
                      <td className="py-4 px-6 text-center font-mono text-zinc-300">
                        <span className="inline-block bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800 text-xs font-semibold">
                          {user.buildCount || 0}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-xs font-bold text-red-400/80 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3.5 py-1.5 rounded-lg border border-red-500/20 transition-all active:scale-95"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
