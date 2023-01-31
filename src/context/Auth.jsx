import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (user) setUser(JSON.parse(user));
    if (token) setToken(token);
  }, []);

  const handleSetTokenAndUser = (payload) => {
    setToken(payload.token);
    setUser(payload.user);

    localStorage.setItem("token", payload.token);
    localStorage.setItem("user", JSON.stringify(payload.user));
  };

  const handleClear = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken("");
    setUser("");
  };

  return (
    <AuthContext.Provider
      value={{
        handleSetTokenAndUser,
        handleClear,
        token,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  return context;
}
