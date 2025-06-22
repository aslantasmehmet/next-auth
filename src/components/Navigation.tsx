"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    isAdmin, 
    canAccessAdmin, 
    signIn, 
    signOut 
  } = useAdminAuth();

  if (isLoading) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <LoadingSpinner />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                NextAuth App
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Ana Sayfa
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    href="/dashboard"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Profil
                  </Link>
                  {canAccessAdmin && (
                    <Link
                      href="/admin"
                      className="border-transparent text-red-500 hover:border-red-300 hover:text-red-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* User Info with Role Badge */}
                <div className="flex items-center space-x-2">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">
                        {user?.email}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        isAdmin 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isAdmin ? 'Admin' : 'Kullanıcı'}
                      </span>
                    </div>
                  </div>
                  {user?.image && (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.image}
                      alt={user.name || 'User'}
                    />
                  )}
                </div>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Giriş Yap
              </button>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Ana menüyü aç</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Ana Sayfa
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                >
                  Profil
                </Link>
                {canAccessAdmin && (
                  <Link
                    href="/admin"
                    className="border-transparent text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  {user?.image && (
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.image}
                      alt={user.name || 'User'}
                    />
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user?.name}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium text-gray-500">
                      {user?.email}
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      isAdmin 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isAdmin ? 'Admin' : 'Kullanıcı'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="ml-auto flex-shrink-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <div className="px-4">
                <button
                  onClick={() => signIn()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Giriş Yap
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 