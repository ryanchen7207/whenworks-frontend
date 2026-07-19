import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("whenworks_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .getMe()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem("whenworks_token"))
      .finally(() => setLoading(false));
  }, []);

  async function doSignup(name, email, password) {
    const { token, user } = await api.signup(name, email, password);
    localStorage.setItem("whenworks_token", token);
    setUser(user);
  }

  async function doLogin(email, password) {
    const { token, user } = await api.login(email, password);
    localStorage.setItem("whenworks_token", token);
    setUser(user);
  }

  function doLogout() {
    localStorage.removeItem("whenworks_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup: doSignup, login: doLogin, logout: doLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
