"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Modern Login Page bileşeni
 * Single Responsibility: Sadece giriş arayüzü sunar
 * TailwindCSS ile stilize edilmiş Auth0 OAuth entegrasyonu
 * NextAuth üzerinden JWT tabanlı kimlik doğrulama sağlar
 */

export default function LoginPage() {
  const { signIn, isLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Giriş yapmışsa dashboard'a yönlendir
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    
    try {
      signIn();
    } catch (err) {
      setError("Giriş yapılamadı. Tekrar deneyin.");
      console.error("Login hatası:", err);
    }
    
    setLoading(false);
  };

  // Yükleniyor durumu
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Başlık kısmı */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Hoş Geldiniz</h2>
            <p className="text-gray-600">Güvenli dashboard&apos;a erişim için giriş yapın</p>
          </div>

          {/* Hata mesajı */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Giriş butonu */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Giriş yapılıyor...
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                </svg>
                Auth0 ile Giriş Yap
              </>
            )}
          </button>

          {/* Alt bilgi */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-indigo-600">Auth0</span> OAuth + JWT ile güvenlik
            </p>
            <div className="mt-2 flex items-center justify-center space-x-2 text-xs text-gray-400">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Uçtan uca şifreli</span>
            </div>
          </div>

          <p className="mt-2 text-center text-sm text-gray-600">
            Hesabınız yok mu?{" "}
            <span className="font-medium text-blue-600">
              Auth0 ile otomatik hesap oluşturulacak
            </span>
          </p>
        </div>

        {/* Teknoloji bilgisi */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Next.js 14 • NextAuth • TypeScript ile geliştirildi
          </p>
        </div>
      </div>
    </div>
  );
} 