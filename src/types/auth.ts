import { DefaultSession, Session } from "next-auth";

/**
 * NextAuth Session tipini genişletiyoruz
 * Auth0'dan gelen ek kullanıcı bilgilerini dahil etmek için
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role?: "admin" | "user";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    role?: "admin" | "user";
  }
}


/**
 * Auth durumları için type definitions
 */
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

/**
 * User role types
 */
export type UserRole = "admin" | "user";


/**
 * Auth context interface
 */
export interface AuthContextType {
  status: AuthStatus;
  user: Session["user"] | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
} 