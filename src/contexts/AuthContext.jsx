import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { login as apiLogin, register as apiRegister, logout as apiLogout, updateProfile as apiUpdateProfile, deleteAccount as apiDeleteAccount } from "@/api/auth";

import { AuthContext } from "./auth-context-definition";

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  const clearJustLoggedIn = () => setJustLoggedIn(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      queryClient.clear();
      const data = await apiLogin(credentials);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setJustLoggedIn(true);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      queryClient.clear();
      const data = await apiRegister(payload);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setJustLoggedIn(true);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiLogout();
    } catch (error) {
      console.error("Failed to revoke token on server", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      setLoading(false);
      queryClient.clear();
    }
  };


  const updateProfile = async (payload) => {
    const updatedUser = await apiUpdateProfile(payload);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  };


  const deleteAccount = async (payload) => {
  setLoading(true);
  try {
    const result = await apiDeleteAccount(payload);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    queryClient.clear();
    return result;
  } finally {
    setLoading(false);
  }
};


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        updateProfile,
        loading,
        justLoggedIn,
        clearJustLoggedIn,
        deleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

