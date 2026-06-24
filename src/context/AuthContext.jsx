import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [guestMode, setGuestMode] = useState(false);

  // Load from sessionStorage on app start
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedGuest = sessionStorage.getItem("guestMode");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedGuest === "true") {
      setGuestMode(true);
    }
  }, []);

  // LOGIN
  const login = (data) => {
    sessionStorage.removeItem("guestMode");

    setGuestMode(false);

    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
  };

  // LOGOUT
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("guestMode");

    setUser(null);
    setGuestMode(false);
  };

  // ENABLE GUEST MODE
  const enableGuestMode = () => {
    sessionStorage.setItem("guestMode", "true");
    setGuestMode(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        guestMode,
        setGuestMode: enableGuestMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
