"use client";

import { useAuthStatus } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuthStatus();

  // Loading durumu - Single Responsibility
  if (isLoading) {
    return <LoadingSpinner fullScreen message="Dashboard yükleniyor..." />;
  }

  // Auth kontrolü
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Erişim reddedildi. Lütfen giriş yapın.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Ana başlık */}
        <DashboardHeader userName={user?.name || undefined} />

        {/* Kullanıcı bilgileri */}
        <UserInfoCard user={user} />

        {/* İstatistikler */}
        <StatsGrid />
      </div>
    </div>
  );
}

// Header Component - Single Responsibility: Sadece başlık gösterimi
function DashboardHeader({ userName }: { userName?: string }) {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Hoş geldin, {userName || "Kullanıcı"}! Bu korumalı bir sayfa.</p>
        </div>
      </div>
    </div>
  );
}

// User Info Card - Single Responsibility: Kullanıcı bilgi gösterimi
function UserInfoCard({ user }: { user: any }) {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Kullanıcı Bilgileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="İsim" value={user?.name || "Belirtilmemiş"} />
          <InfoItem label="E-posta" value={user?.email || "Belirtilmemiş"} />
          <InfoItem label="Giriş Durumu" value="Aktif" badge="green" />
          <InfoItem label="Yetki Seviyesi" value="Kullanıcı" badge="blue" />
        </div>
      </div>
    </div>
  );
}

// Info Item - Single Responsibility: Tek bilgi gösterimi
function InfoItem({ label, value, badge }: { 
  label: string; 
  value: string; 
  badge?: "green" | "blue" 
}) {
  const badgeClasses = {
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800"
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {badge ? (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[badge]}`}>
          {value}
        </span>
      ) : (
        <p className="mt-1 text-sm text-gray-900">{value}</p>
      )}
    </div>
  );
}

// Stats Grid - Single Responsibility: İstatistik kartları
function StatsGrid() {
  const stats = [
    {
      title: "Başarılı Giriş",
      value: "JWT Token Geçerli",
      icon: "check",
      color: "green"
    },
    {
      title: "Güvenlik",
      value: "Auth0 OAuth",
      icon: "shield",
      color: "blue"
    },
    {
      title: "Teknoloji",
      value: "Next.js 14",
      icon: "lightning",
      color: "purple"
    }
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
}

// Stat Card - Single Responsibility: Tek istatistik kartı
function StatCard({ title, value, icon, color }: {
  title: string;
  value: string;
  icon: string;
  color: string;
}) {
  const colorClasses = {
    green: "bg-green-100",
    blue: "bg-blue-100", 
    purple: "bg-purple-100"
  };

  const iconClasses = {
    green: "text-green-600",
    blue: "text-blue-600",
    purple: "text-purple-600"
  };

  const getIcon = (iconType: string) => {
    const icons = {
      check: "M5 13l4 4L19 7",
      shield: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
      lightning: "M13 10V3L4 14h7v7l9-11h-7z"
    };
    return icons[iconType as keyof typeof icons] || icons.check;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`h-8 w-8 ${colorClasses[color as keyof typeof colorClasses]} rounded-md flex items-center justify-center`}>
            <svg className={`h-5 w-5 ${iconClasses[color as keyof typeof iconClasses]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(icon)} />
            </svg>
          </div>
        </div>
        <div className="ml-5">
          <dt className="text-sm font-medium text-gray-500">{title}</dt>
          <dd className="text-lg font-medium text-gray-900">{value}</dd>
        </div>
      </div>
    </div>
  );
} 