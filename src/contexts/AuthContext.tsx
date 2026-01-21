"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { UserSession, UserRole } from "@/types/auth";
import { authService } from "@/services/authService";

interface AuthContextType {
  user: UserSession | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  console.log("🔒 AuthProvider: Rendering...");

  if (typeof window !== 'undefined') {
    console.log("🔒 AuthProvider: CRASH TEST INITIATED");
    // throw new Error("CRASH TEST: AUTH PROVIDER IS MOUNTING");
  }

  // Load user from backend on mount (using cookie)
  useEffect(() => {
    console.log("🔒 AuthProvider: useEffect mounted! Starting user fetch...");
    const fetchUser = async () => {
      try {
        console.log("🔒 AuthProvider: Calling authService.getCurrentUser()...");
        const data = await authService.getCurrentUser();
        console.log("🔒 AuthProvider: User fetched successfully:", data);

        setUser({
          userId: data.user.id,
          username: data.user.username,
          role: data.user.role,
        });
      } catch (error: any) {
        console.error("🔒 AuthProvider: User fetch failed:", error);
        // No valid session cookie
        setUser(null);
        // Fallback: If on a protected route, redirect to login
        if (!window.location.pathname.startsWith('/auth')) {
          console.log("🔒 AuthProvider: Redirecting to /auth/sign-in");
          router.push('/auth/sign-in');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const data = await authService.login(username, password);

      // Backend sets HTTP-only cookie automatically
      setUser({
        userId: data.user.id,
        username: data.user.username,
        role: data.user.role,
      });

      router.push("/");
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear cookies automatically handled by backend
      setUser(null);
      router.push("/auth/sign-in");
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    // This will be implemented with the permission system
    return true; // Placeholder
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission,
        hasRole,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
