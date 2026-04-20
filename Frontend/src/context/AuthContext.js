import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/axios";
import { useMemo } from "react";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  let isMounted = true;

  const loadUser = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");

      if (storedToken && storedUser && isMounted) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      }
    } catch (e) {
      console.log(e);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  loadUser();

  return () => {
    isMounted = false;
  };
}, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: t, user: u } = res.data.data;
    setToken(t);
    setUser(u);
    api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    await AsyncStorage.setItem("token", t);
    await AsyncStorage.setItem("user", JSON.stringify(u));
    return u;
  };

  const register = async (name, email, password, role = "student") => {
    const res = await api.post("/auth/register", { name, email, password, role });
    const { token: t, user: u } = res.data.data;
    setToken(t);
    setUser(u);
    api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    await AsyncStorage.setItem("token", t);
    await AsyncStorage.setItem("user", JSON.stringify(u));
    return u;
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  const value = useMemo(() => ({
  user,
  token,
  loading,
  login,
  register,
  logout
}), [user, token, loading]);
  return (
    <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
