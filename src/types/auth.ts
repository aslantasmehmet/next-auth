import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

/**
 * NextAuth Session tipini genişletiyoruz
 * Auth0'dan gelen ek kullanıcı bilgilerini dahil etmek için
 */
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
    accessToken?: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: UserRole;
    permissions: UserPermissions;
    lastLogin?: Date;
    isActive: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role: UserRole;
    permissions: UserPermissions;
    isActive: boolean;
  }
}

/**
 * Auth durumları için type definitions
 */
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

/**
 * User role types
 */
export type UserRole = 'admin' | 'user';

/**
 * Kullanıcı yetkileri
 */
export interface UserPermissions {
  canManageUsers: boolean;
  canViewAnalytics: boolean;
  canEditProfile: boolean;
  canAccessAdmin: boolean;
}

/**
 * Genişletilmiş kullanıcı bilgileri
 */
export interface ExtendedUser extends DefaultUser {
  role: UserRole;
  permissions: UserPermissions;
  lastLogin?: Date;
  isActive: boolean;
}

/**
 * Auth context interface
 */
export interface AuthContextType {
  user: ExtendedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: keyof UserPermissions) => boolean;
  signIn: () => void;
  signOut: () => void;
} 