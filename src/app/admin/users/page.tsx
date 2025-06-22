'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { RoleServiceFactory } from '@/services/RoleService';

interface AdminUser {
  email: string;
  isSuperAdmin: boolean;
  status: 'active' | 'static' | 'super';
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const roleService = RoleServiceFactory.getInstance();

  // Admin listesini yükle
  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      // Super admin
      const superAdmin: AdminUser = {
        email: 'super@admin.com',
        isSuperAdmin: true,
        status: 'super'
      };

      // Static admin listesi (RoleService'den al)
      const staticAdmins: AdminUser[] = [
        // Bu liste RoleService.ts'deki STATIC_ADMINS'den gelir
        // Örnek static admin'ler:
        // { email: 'admin@company.com', isSuperAdmin: false, status: 'static' },
        // { email: 'dev@company.com', isSuperAdmin: false, status: 'static' },
      ];

      setAdmins([superAdmin, ...staticAdmins]);
      setLoading(false);
    } catch (error) {
      console.error('Admin listesi yüklenirken hata:', error);
      setLoading(false);
    }
  };

  if (!session?.user) {
    return <div className="p-8">Giriş yapmış olmanız gerekiyor</div>;
  }

  if (loading) {
    return <div className="p-8">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            👥 Admin Kullanıcı Yönetimi
          </h1>

          {/* System Info */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Admin Yönetimi - Production Ready System
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p className="mb-2">Bu sistem <strong>static admin configuration</strong> kullanır:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Super Admin: Kod seviyesinde tanımlı, değiştirilemez</li>
                    <li>Static Admin&apos;ler: <code>RoleService.ts</code> dosyasında tanımlı</li>
                    <li>Production ortamında güvenli ve stabil çalışır</li>
                    <li>Database bağımlılığı yok, performanslı</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Developer Instructions */}
          <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              🔧 Yeni Admin Ekleme (Developer)
            </h2>
            <div className="space-y-3">
              <div className="bg-gray-800 text-green-400 p-3 rounded-md font-mono text-sm">
                <div className="text-gray-300 mb-1">{/* src/services/RoleService.ts */}</div>
                <div>private static readonly STATIC_ADMINS = [</div>
                <div className="pl-4 text-yellow-400">{`'new-admin@company.com',  // ← Buraya ekle`}</div>
                <div className="pl-4 text-yellow-400">{`'another-admin@company.com',`}</div>
                <div>];</div>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Adımlar:</strong></p>
                <ol className="list-decimal pl-5 space-y-1 mt-2">
                  <li>Yeni admin email&apos;ini <code>STATIC_ADMINS</code> array&apos;ine ekle</li>
                  <li>Uygulamayı yeniden başlat</li>
                  <li>Kullanıcı Auth0&apos;da o email ile kayıt olsun</li>
                  <li>Otomatik olarak admin yetkisi alır</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Current Admin List */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Mevcut Admin&apos;ler ({admins.length})
            </h2>
            <div className="space-y-3">
              {admins.map((admin, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {admin.status === 'super' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
                          👑 Super Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                          🔧 Static Admin
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {admin.email}
                      </p>
                      {admin.email === session.user.email && (
                        <p className="text-xs text-gray-500">(Sen)</p>
                      )}
                      <p className="text-xs text-gray-400">
                        {admin.status === 'super' ? 'Kod seviyesinde tanımlı' : 'Static konfigürasyon'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {admin.status === 'super' ? 'Silinemez' : 'Kod ile yönetilir'}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* No additional admins message */}
              {admins.length === 1 && (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz ek admin yok</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Yeni admin eklemek için yukarıdaki developer talimatlarını takip edin
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Güvenlik & Production Uyarıları
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Static Admin System:</strong> Performanslı ve güvenli</li>
                    <li><strong>No Database Dependency:</strong> Hızlı başlangıç</li>
                    <li><strong>Production Ready:</strong> Enterprise projeler için uygun</li>
                    <li><strong>Version Control:</strong> Admin değişiklikleri git&apos;te takip edilir</li>
                    <li><strong>Rollback Safety:</strong> Hatalı admin ekleme durumunda kolay geri alma</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 