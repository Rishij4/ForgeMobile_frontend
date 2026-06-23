import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("user")) || null
  );

  const [guestMode, setGuestMode] = useState(
    sessionStorage.getItem("guestMode") === "true"
  );

  const login = (data) => {
    sessionStorage.removeItem("guestMode");
    setGuestMode(false);

    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
  };

  return (
  <AuthContext.Provider
    value={{
      user,
      login,
      logout,
      guestMode,
      setGuestMode
    }}
  >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);