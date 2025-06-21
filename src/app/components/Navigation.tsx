"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * Navigasyon bileşeni
 * Single Responsibility: Sadece navigasyon ve oturum durumunu yönetir
 * Open/Closed Principle: Yeni menü öğeleri için genişletilebilir yapı sağlar
 */

export default function Navigation() {
  const { user, status, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo kısmı */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">NextAuth</span>
          </Link>

          {/* Navigasyon menüsü */}
          <div className="flex items-center space-x-4">
            {status === "loading" && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            )}

            {status === "authenticated" && user ? (
              <div className="flex items-center space-x-4">
                {/* Kullanıcı bilgileri */}
                <div className="flex items-center space-x-3">
                  {user.image && (
                    <img
                      src={user.image}
                      alt={user.name || "Kullanıcı"}
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <div className="text-sm">
                    <p className="text-gray-900 font-medium">
                      {user.name || "Kullanıcı"}
                    </p>
                    <p className="text-gray-500 text-xs">{user.email}</p>
                  </div>
                </div>

                {/* Menü linkleri */}
                <div className="flex items-center space-x-2">
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Profil
                  </Link>
                </div>

                {/* Çıkış butonu */}
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              status === "unauthenticated" && (
                <button
                  onClick={handleSignIn}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Giriş Yap
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 