import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Lab from "./pages/Lab";
import Compare from "./pages/Compare";
import Glossary from "./pages/Glossary";
import SavedBuilds from "./pages/SavedBuilds";
import Tiers from "./pages/Tiers";
import Profile from "./pages/Profile";
import SharedBuild from "./pages/SharedBuild";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Admin/Dashboard";

const App = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center max-w-xl">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto rounded-full border-4 border-red-500 animate-pulse flex items-center justify-center">
              <span className="text-3xl">❌</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-red-500">
            SYSTEM OFFLINE
          </h1>

          <p className="mt-6 text-indigo-400 text-sm">
            No internet connection detected.
          </p>

          <p className="mt-2 text-indigo-400 text-sm">
            Reconnect to continue using ForgeMobile
          </p>
        </div>
      </div>
    );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/tiers" element={<Tiers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shared/:id" element={<SharedBuild />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />

        {/* updated route */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/lab"
          element={
            <ProtectedRoute allowGuest={true}>
              <Lab />
            </ProtectedRoute>
          }
        />

        <Route
          path="/compare"
          element={
            <ProtectedRoute allowGuest={true}>
              <Compare />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved-builds"
          element={
            <ProtectedRoute>
              <SavedBuilds />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="dark"
      />
    </BrowserRouter>
  );
};

export default App;
