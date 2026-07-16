"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { authService } from "@/services/authService";

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function refreshUser() {
    try {
      const currentUser =
        await authService.me();

      setUser(currentUser);
    } catch {
      setUser(null);
    }
  }

  async function logout() {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }

  useEffect(() => {
    async function loadUser() {
      await refreshUser();
      setLoading(false);
    }

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}