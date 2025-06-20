"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { AuthContextType } from "@/types/auth";

/**
 * Custom authentication hook
 * Single Responsibility: Sadece authentication state yönetimi
 * NextAuth'u abstract ederek dependency injection sağlar
 */
export function useAuth(): AuthContextType {
  const { data: session, status } = useSession();

  const handleSignIn = async () => {
    await signIn("auth0");
  };

  const handleSignOut = async () => {
    await signOut();
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
export function useRequireAuth() {
  const { status, user } = useAuth();
  
  return {
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",
    user,
  };
} 