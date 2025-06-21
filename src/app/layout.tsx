import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next Auth - Auth0 OAuth JWT",
  description: "Next.js 14 + NextAuth + Auth0 OAuth JWT Authentication System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <ErrorBoundary>
          <SessionWrapper>
            {children}
          </SessionWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}
