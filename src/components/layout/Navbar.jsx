// Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({
  hasActiveBuild,
  onStartBuild,
  onResetLab,
  onNavigateAway
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, guestMode, setGuestMode } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); toast.success("Logged out successfully"); navigate("/"); };
const handleExitGuest = () => {
  sessionStorage.removeItem("guestMode");
  setGuestMode(false);
  toast.success("Exited guest mode");
  navigate("/");
};
  const handleStartBuild = () => {
    if (!user && !guestMode) return navigate("/login");
    location.pathname === "/lab" ? onStartBuild?.() : navigate("/lab");
    setMenuOpen(false);
  };
  const handleLabNavigation = () => {
  if (location.pathname === "/lab" && hasActiveBuild) {
    onResetLab?.();
    return;
  }

  navigate("/lab");
  setMenuOpen(false);
};

const handleProtectedNavigation = (path) => {
  if (location.pathname === "/lab" && hasActiveBuild) {
    onNavigateAway?.(path);
    return;
  }

  navigate(path);
};

  const getNavLinkClass = (path) => location.pathname === path
    ? "text-indigo-400 relative pb-1 font-medium transition-colors"
    : "text-gray-300 hover:text-indigo-400 relative pb-1 font-medium transition-colors duration-300";

  const menuVariants = {
    closed: { opacity: 0, height: 0, transition: { when: "afterChildren", duration: 0.3, ease: "easeInOut" } },
    open: { opacity: 1, height: "auto", transition: { when: "beforeChildren", duration: 0.4, ease: "easeInOut" } },
  };

  const itemVariants = { closed: { opacity: 0, x: -16 }, open: { opacity: 1, x: 0 } };

  // Nav mapping schema to cleanly reduce structural replication
  const navLinks = [
    { path: "/", label: "Explore", show: true },
    { path: "/lab", label: "The Lab", show: user || guestMode },
    { path: "/compare", label: "Compare", show: !!user },
    { path: "/saved-builds", label: "Saved Builds", show: !!user },
    { path: "/tiers", label: "Tiers", show: !!user },
    { path: "/glossary", label: "Glossary", show: true }
  ];

  return (
    <nav className="bg-black/60 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div whileHover={{ scale: 1.05, rotate: 6 }} whileTap={{ scale: 0.95 }} className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">F</motion.div>
          <h1 className="text-lg sm:text-xl font-bold tracking-wider text-white">FORGE <span className="text-indigo-500">MOBILE</span></h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.filter(l => l.show).map(link =>
  link.path === "/lab" ? (
    <button
      key={link.path}
      onClick={handleLabNavigation}
      className={getNavLinkClass(link.path)}
    >
      {link.label}
      {location.pathname === link.path && (
        <motion.span
          layoutId="underline"
          className="absolute left-0 bottom-0 w-full h-[2px] bg-indigo-500"
        />
      )}
    </button>
  ) : (
  <button
    key={link.path}
    onClick={() => handleProtectedNavigation(link.path)}
    className={getNavLinkClass(link.path)}
  >
    {link.label}
      {location.pathname === link.path && (
        <motion.span
          layoutId="underline"
          className="absolute left-0 bottom-0 w-full h-[2px] bg-indigo-500"
        />
      )}
    </button>
  )
)}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {guestMode ? (
            <><span className="text-sm text-indigo-400">Guest Mode</span><button onClick={handleExitGuest} className="text-sm text-red-400">Exit Guest</button></>
          ) : !user ? (
            <><Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Login</Link><Link to="/register" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Register</Link></>
          ) : (
            <>
              <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 font-bold text-xs">{user.username[0].toUpperCase()}</div>
                <span className="max-w-[100px] truncate">Hi, {user.username}</span>
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-gray-400 hover:text-red-400 transition-colors">Logout</button>
            </>
          )}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleStartBuild} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 text-sm font-medium rounded-full shadow-lg shadow-indigo-600/20 transition-all">Start Build</motion.button>
        </div>

        {/* Hamburger Toggle */}
        <button className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 z-50 text-white focus:outline-none" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-6 bg-current transition duration-300 ease-in-out ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div variants={menuVariants} initial="closed" animate="open" exit="closed" className="md:hidden bg-black/95 backdrop-blur-2xl border-t border-white/10 overflow-hidden">
            <div className="px-6 py-6 space-y-4 flex flex-col font-medium text-lg">
              {navLinks.filter(l => l.show).map(link => (
  <motion.div key={link.path} variants={itemVariants}>
    {link.path === "/lab" ? (
  <button
    onClick={handleLabNavigation}
    className="block py-1 text-gray-300 hover:text-indigo-400 text-left w-full"
  >
    {link.label}
  </button>
) : (
  <button
    onClick={() => handleProtectedNavigation(link.path)}
    className="block py-1 text-gray-300 hover:text-indigo-400 text-left w-full"
  >
    {link.label}
  </button>
)}
  </motion.div>
))}
              <hr className="border-white/10 my-2" />
              {guestMode ? (
                <><motion.div variants={itemVariants}><span className="block py-1 text-indigo-400">Guest Mode</span></motion.div><motion.div variants={itemVariants}><button onClick={handleExitGuest} className="block py-1 text-red-400 text-left w-full">Exit Guest</button></motion.div></>
              ) : !user ? (
                <><motion.div variants={itemVariants}><Link to="/login" className="block py-1 text-gray-300 hover:text-indigo-400">Login</Link></motion.div><motion.div variants={itemVariants}><Link to="/register" className="block py-1 text-gray-300 hover:text-indigo-400">Register</Link></motion.div></>
              ) : (
                <><motion.div variants={itemVariants}><Link to="/profile" className="block py-1 text-gray-300 hover:text-indigo-400">Profile</Link></motion.div><motion.div variants={itemVariants}><button onClick={handleLogout} className="block py-1 text-red-400 text-left w-full">Logout</button></motion.div></>
              )}
              <motion.div variants={itemVariants} className="pt-2"><button onClick={handleStartBuild} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium active:scale-95 transition-transform text-center shadow-lg shadow-indigo-600/20">Start Build</button></motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;