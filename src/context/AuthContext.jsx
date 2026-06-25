import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [guestMode, setGuestMode] = useState(
    sessionStorage.getItem("guestMode") === "true"
  );


  useEffect(() => {

    const checkUser = async () => {

      const token =
        sessionStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {

        await API.get("/auth/validate");

        const storedUser =
          sessionStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

      } catch {

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        setUser(null);
      }

      setLoading(false);
    };

    checkUser();

  }, []);



  const login = (data) => {

    sessionStorage.removeItem("guestMode");
    setGuestMode(false);

    sessionStorage.setItem(
      "token",
      data.token
    );

    sessionStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

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
        loading,
        guestMode,
        setGuestMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () =>
  useContext(AuthContext);
