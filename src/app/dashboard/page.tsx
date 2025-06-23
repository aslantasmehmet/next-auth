"use client";

import { useSession } from "next-auth/react";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const isAuthenticated = status === "authenticated";
  const user = session?.user as any;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (status !== "loading" && !isAuthenticated) {
      router.push("/login");
    }
  }, [status, isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Redirect olurken boş sayfa göster
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Ana başlık */}
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 mb-6">
            <div className="text-center">
              <div className={`mx-auto h-20 w-20 ${isAdmin ? 'bg-red-100' : 'bg-indigo-100'} rounded-full flex items-center justify-center mb-4`}>
                {isAdmin ? (
                  <span className="text-3xl">👑</span>
                ) : (
                  <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
              </h1>
              <p className="text-gray-600">
                {isAdmin 
                  ? `Hoş geldin, ${user?.name}! Admin yetkilerinle sistemi yönetebilirsin.`
                  : `Hoş geldin, ${user?.name}! Bu senin kişisel dashboard'ın.`
                }
              </p>
            </div>
          </div>

          {/* Kullanıcı bilgileri */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Kullanıcı Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">İsim</label>
                <p className="mt-1 text-sm text-gray-900">{user?.name || "Belirtilmemiş"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-posta</label>
                <p className="mt-1 text-sm text-gray-900">{user?.email || "Belirtilmemiş"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Giriş Durumu</label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Aktif
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Yetki Seviyesi</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isAdmin ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {isAdmin ? '👑 Admin' : 'Kullanıcı'}
                </span>
              </div>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-green-100 rounded-md flex items-center justify-center">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <dt className="text-sm font-medium text-gray-500">Başarılı Giriş</dt>
                  <dd className="text-lg font-medium text-gray-900">JWT Token Geçerli</dd>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <dt className="text-sm font-medium text-gray-500">Güvenlik</dt>
                  <dd className="text-lg font-medium text-gray-900">Auth0 OAuth</dd>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-purple-100 rounded-md flex items-center justify-center">
                    <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <dt className="text-sm font-medium text-gray-500">Teknoloji</dt>
                  <dd className="text-lg font-medium text-gray-900">Next.js 14</dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 