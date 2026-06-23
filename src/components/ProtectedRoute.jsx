import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowGuest = false }) => {
  const { user } = useAuth();

  const isGuest =
    sessionStorage.getItem("guestMode") === "true";

  // logged in user → allow
  if (user) {
    return children;
  }

  // guest allowed route → allow
  if (allowGuest && isGuest) {
    return children;
  }

  // otherwise login
  return <Navigate to="/login" />;
};

export default ProtectedRoute;