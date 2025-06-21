"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { AuthContextType } from "@/types/auth";
import { IAuthService, AuthServiceFactory } from "@/services/AuthService";
import { useMemo } from "react";

/**
 * Custom authentication hook
 * Single Responsibility: Sadece authentication state yönetimi
 * NextAuth'u abstract ederek dependency injection sağlar
 */
export function useAuth(): AuthContextType {
  const { data: session, status } = useSession();
  
  // Dependency Injection: Service'i factory'den al
  const authService: IAuthService = useMemo(() => {
    return AuthServiceFactory.create();
  }, []);

  const handleSignIn = async () => {
    try {
      await authService.login();
    } catch (error) {
      console.error("Giriş hook hatası:", error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Çıkış hook hatası:", error);
      throw error;
    }
  };

  return {
    status: status as AuthContextType["status"],
    user: session?.user || null,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}

/**
 * Auth durumunu kontrol eden utility hook
 */
export function useAuthStatus() {
  const { status, user } = useAuth();
  
  return {
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",
    user,
  };
}

/**
 * Protected route hook
 * Single Responsibility: Sadece yetki kontrolü
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuthStatus();
  
  return {
    isAllowed: isAuthenticated,
    isLoading,
    shouldRedirect: !isLoading && !isAuthenticated
  };
} 