import { useState, useCallback } from "react";
import AuthContext from "./AuthContext.js";
import * as authService from "../services/authService.js";

const STORAGE_KEY = "noxinbox_user";

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const persist = useCallback((u) => {
    setUser(u);
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(
    async ({ email, password }) => {
      const data = await authService.login({ email, password });
      persist(data);
      return data;
    },
    [persist]
  );

  const registerManager = useCallback(
    async (form) => {
      const data = await authService.registerManager(form);
      persist(data);
      return data;
    },
    [persist]
  );

  const registerEmployee = useCallback(
    async (form) => {
      const data = await authService.registerEmployee(form);
      persist(data);
      return data;
    },
    [persist]
  );

  const logout = useCallback(() => {
    persist(null);
  }, [persist]);

  const value = {
    user,
    isAuthenticated: !!user,
    isManager: user?.role === "MANAGER",
    login,
    registerManager,
    registerEmployee,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
