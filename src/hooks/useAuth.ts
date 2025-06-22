"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { AuthContextType, ExtendedUser, UserRole, UserPermissions } from "@/types/auth";
import { IAuthService, AuthServiceFactory } from "@/services/AuthService";
import { useMemo } from "react";
import { RoleServiceFactory } from "@/services/RoleService";

/**
 * Enhanced authentication hook with role-based authorization
 * SOLID Principles: Single Responsibility - Auth state management
 */
export function useAuth(): AuthContextType {
  const { data: session, status } = useSession();
  const roleService = RoleServiceFactory.getInstance();

  const user = session?.user as ExtendedUser | null;
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!user;

  /**
   * Kullanıcının belirli bir rolü olup olmadığını kontrol eder
   */
  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  /**
   * Kullanıcının belirli bir yetkisi olup olmadığını kontrol eder
   */
  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (!user) return false;
    return roleService.hasPermission(user, permission);
  };

  /**
   * Oturum açma işlemi
   */
  const handleSignIn = () => {
    signIn("auth0");
  };

  /**
   * Oturum kapatma işlemi
   */
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    hasRole,
    hasPermission,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}

/**
 * Admin yetkilerini kontrol eden hook
 * SOLID Principles: Interface Segregation - Specific use case
 */
export function useAdminAuth() {
  const auth = useAuth();
  
  return {
    ...auth,
    isAdmin: auth.hasRole('admin'),
    canManageUsers: auth.hasPermission('canManageUsers'),
    canViewAnalytics: auth.hasPermission('canViewAnalytics'),
    canAccessAdmin: auth.hasPermission('canAccessAdmin'),
  };
}

/**
 * Route protection hook
 * SOLID Principles: Single Responsibility - Route authorization
 */
export function useRouteProtection(requiredRole?: UserRole) {
  const { user, isLoading, isAuthenticated, hasRole } = useAuth();
  const roleService = RoleServiceFactory.getInstance();

  const canAccessRoute = (route: string): boolean => {
    if (!user) return false;
    return roleService.canAccessRoute(user, route);
  };

  const hasRequiredRole = requiredRole ? hasRole(requiredRole) : true;

  return {
    user,
    isLoading,
    isAuthenticated,
    hasRequiredRole,
    canAccessRoute,
    shouldRedirect: !isLoading && (!isAuthenticated || !hasRequiredRole),
  };
}

/**
 * Auth durumunu kontrol eden utility hook
 */
export function useAuthStatus() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  return {
    isLoading,
    isAuthenticated,
    isUnauthenticated: !isLoading && !isAuthenticated,
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