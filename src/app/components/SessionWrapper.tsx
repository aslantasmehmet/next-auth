"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface SessionWrapperProps {
  children: ReactNode;
}

/**
 * NextAuth SessionProvider wrapper component
 * Client-side authentication state yönetimi sağlar
 * App Router uyumlu olarak tasarlandı
 */
export default function SessionWrapper({ children }: SessionWrapperProps) {
  return <SessionProvider>{children}</SessionProvider>;
} 