"use client";

import { useSession } from "next-auth/react";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
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
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Profil başlık */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Profil Ayarları</h1>
            <p className="mt-2 text-gray-600">Kişisel bilgilerinizi görüntüleyin ve yönetin.</p>
          </div>

          {/* Profil kartı */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {user?.image ? (
                    <img className="h-20 w-20 rounded-full" src={user.image} alt={user.name || ""} />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                      <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name || "Kullanıcı"}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-gray-500 mr-2">Auth0 ile doğrulandı</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isAdmin ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isAdmin ? '👑 Admin' : 'Kullanıcı'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kişisel bilgiler */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Kişisel Bilgiler</h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                  <p className="mt-1 text-sm text-gray-900">{user?.name || "Belirtilmemiş"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">E-posta</label>
                  <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                  <p className="mt-1 text-xs text-gray-500">E-posta Auth0 tarafından yönetiliyor</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hesap Türü</label>
                  <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    OAuth Kullanıcısı
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Yetki Seviyesi</label>
                  <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isAdmin ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isAdmin ? '👑 Admin' : 'Kullanıcı'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Güvenlik bilgileri */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Güvenlik</h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kimlik Doğrulama</label>
                  <div className="mt-2 flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-900">Auth0 OAuth ile doğrulandı</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">JWT Token</label>
                  <div className="mt-2 flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-900">Aktif ve geçerli</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Oturum Güvenliği</label>
                  <div className="mt-2 flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-sm text-gray-900">HTTPS şifrelemesi aktif</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 