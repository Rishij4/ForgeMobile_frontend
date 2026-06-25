import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowGuest = false }) => {
  const { user, loading } = useAuth();

  const isGuest =
    sessionStorage.getItem("guestMode") === "true";

  // wait until auth restores
  if (loading) {
    return null; 
    // or loading spinner
  }

  if (user) {
    return children;
  }

  if (allowGuest && isGuest) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
