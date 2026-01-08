"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../../lib/api";
import type { User } from "../../lib/types";
import { safeJsonParse } from "../../lib/storage";

type AuthState = {
  token: string | null;
  user: User | null;
  loading: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const LS_KEY = "specific_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = safeJsonParse<{ token: string; user: User }>(
      typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null
    );
    if (saved?.token && saved?.user) {
      setToken(saved.token);
      setUser(saved.user);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) return;
    api
      .me(token)
      .then(({ user }) => {
        const normalized: User = {
          name: user.name,
          email: user.email,
          role: user.role,
          id: user._id,
        };
        setUser(normalized);
        localStorage.setItem(LS_KEY, JSON.stringify({ token, user: normalized }));
      })
      .catch(() => {
        // token invalid; clear
        localStorage.removeItem(LS_KEY);
        setToken(null);
        setUser(null);
      });
  }, [token]);

  const setAuth = useCallback((t: string, u: User) => {
    setToken(t);
    setUser(u);
    localStorage.setItem(LS_KEY, JSON.stringify({ token: t, user: u }));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(LS_KEY);
  }, []);

  const value = useMemo(
    () => ({ token, user, loading, setAuth, logout }),
    [token, user, loading, setAuth, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
