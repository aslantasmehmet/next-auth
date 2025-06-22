"use client";

import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Ana başlık */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Next.js 14 + <span className="text-indigo-600">Auth0</span><br />OAuth + JWT
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            Modern Next.js 14 App Router ile güvenli kimlik doğrulama sistemi. 
            Auth0 OAuth entegrasyonu ve JWT tabanlı oturum yönetimi ile 
            kullanıcılarınızın verilerini koruyun.
          </p>
          
          {!isLoading && !isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg font-semibold">
                Başlayın
              </Link>
              <a href="https://github.com/aslantasmehmet/next-auth" target="_blank" rel="noopener noreferrer" className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold">
                GitHub&apos;da Görüntüle
              </a>
            </div>
          )}
        </div>

        {/* Hoş geldin mesajı */}
        {isAuthenticated && user && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-gray-100">
            <div className="text-center">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tekrar hoş geldin, {user.name}!
              </h2>
              <p className="text-gray-600 mb-6">JWT token ile başarıyla giriş yaptınız</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold">
                  Dashboard&apos;a Git
                </Link>
                <Link href="/profile" className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2 rounded-lg font-semibold">
                  Profili Görüntüle
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Özellikler */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Güvenli Kimlik Doğrulama</h3>
            <p className="text-gray-600">Auth0 OAuth sağlayıcısı ile JWT token kullanarak kurumsal seviye güvenlik</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">SOLID Prensipleri</h3>
            <p className="text-gray-600">Temiz mimari, dependency injection ve sorumlulukların ayrılması</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Next.js 14 App Router</h3>
            <p className="text-gray-600">En yeni Next.js özellikleri ile server-side rendering ve middleware</p>
          </div>
        </div>

        {/* Teknoloji yığını */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Modern Teknolojilerle Geliştirildi</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Next.js 14", color: "bg-black" },
              { name: "TypeScript", color: "bg-blue-600" },
              { name: "TailwindCSS", color: "bg-cyan-500" },
              { name: "Auth0", color: "bg-orange-500" },
            ].map((tech) => (
              <div key={tech.name} className="text-center">
                <div className={`h-16 w-16 ${tech.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-white font-bold text-sm">{tech.name.charAt(0)}</span>
                </div>
                <p className="text-sm font-medium text-gray-700">{tech.name}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-lg text-gray-600 mb-8">
          Endüstri standardı güvenlik protokolleri ile korunan, 
          ölçeklenebilir kimlik doğrulama çözümü. SOLID prensipleri 
          ve 12Factor metodolojisi ile geliştirildi.
        </p>
      </main>
    </div>
  );
}
