import { UserRole, UserPermissions, ExtendedUser } from '@/types/auth';

// Interface Segregation Principle - Role management interface
export interface IRoleService {
  getUserRole(email: string): Promise<UserRole>;
  getPermissions(role: UserRole): UserPermissions;
  hasPermission(user: ExtendedUser, permission: keyof UserPermissions): boolean;
  isAdmin(user: ExtendedUser): boolean;
  canAccessRoute(user: ExtendedUser, route: string): boolean;
  // Admin management methods
  addAdmin(email: string): Promise<boolean>;
  removeAdmin(email: string): Promise<boolean>;
  getAllAdmins(): Promise<string[]>;
  isSuperAdmin(email: string): boolean;
}

// Single Responsibility Principle - Role configuration
class RoleConfiguration {
  // Super Admin - İlk admin (değiştirilemez)
  private static readonly SUPER_ADMIN_EMAIL = 'kayraexport@testadmin.com';
  
  // Static admin listesi (server-side için) - admin panelden eklenen emailler buraya elle eklenir
  private static readonly STATIC_ADMINS = [
    // Örnek: admin panelden eklediğin email'leri buraya ekle
    // 'test@example.com',
    // 'admin@company.com',
    'testadmin@testadmin.com',
  ];

  private static readonly ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
    admin: {
      canManageUsers: true,
      canViewAnalytics: true,
      canEditProfile: true,
      canAccessAdmin: true,
    },
    user: {
      canManageUsers: false,
      canViewAnalytics: false,
      canEditProfile: true,
      canAccessAdmin: false,
    },
  };

  static isSuperAdmin(email: string): boolean {
    return email.toLowerCase() === this.SUPER_ADMIN_EMAIL.toLowerCase();
  }

  static getDynamicAdmins(): string[] {
    // Static sistem - sadece tanımlı admin'leri döndür
    return this.STATIC_ADMINS;
  }

  static isAdminEmail(email: string): boolean {
    // Super admin check
    if (this.isSuperAdmin(email)) return true;
    
    // Static admin check
    const staticAdmins = this.getDynamicAdmins();
    return staticAdmins.includes(email.toLowerCase());
  }

  static getPermissions(role: UserRole): UserPermissions {
    return this.ROLE_PERMISSIONS[role];
  }
}

// Open/Closed Principle - Extensible role service
export class RoleService implements IRoleService {
  /**
   * E-posta adresine göre kullanıcı rolünü belirler
   */
  async getUserRole(email: string): Promise<UserRole> {
    // Gerçek uygulamada bu bilgi veritabanından gelir
    return RoleConfiguration.isAdminEmail(email) ? 'admin' : 'user';
  }

  /**
   * Role göre yetkileri döndürür
   */
  getPermissions(role: UserRole): UserPermissions {
    return RoleConfiguration.getPermissions(role);
  }

  /**
   * Kullanıcının belirli bir yetkisi olup olmadığını kontrol eder
   */
  hasPermission(user: ExtendedUser, permission: keyof UserPermissions): boolean {
    return user.permissions[permission] === true;
  }

  /**
   * Kullanıcının admin olup olmadığını kontrol eder
   */
  isAdmin(user: ExtendedUser): boolean {
    return user.role === 'admin';
  }

  /**
   * Kullanıcının belirli bir route'a erişim yetkisi olup olmadığını kontrol eder
   */
  canAccessRoute(user: ExtendedUser, route: string): boolean {
    const adminRoutes = ['/admin', '/dashboard/analytics', '/dashboard/users'];
    const userRoutes = ['/profile', '/dashboard'];

    if (adminRoutes.some(adminRoute => route.startsWith(adminRoute))) {
      return this.isAdmin(user);
    }

    if (userRoutes.some(userRoute => route.startsWith(userRoute))) {
      return user.isActive;
    }

    return true; // Public routes
  }

  // Admin management methods - Static system only
  async addAdmin(email: string): Promise<boolean> {
    // Static system - kod seviyesinde manual ekleme gerekli
    console.log('🔧 STATIC ADMIN EKLEME TALİMATI:');
    console.log(`1. src/services/RoleService.ts dosyasını aç`);
    console.log(`2. STATIC_ADMINS array'ine ekle: '${email.toLowerCase()}',`);
    console.log(`3. Uygulamayı yeniden başlat`);
    return false; // UI'da manual talimat görünür
  }

  async removeAdmin(email: string): Promise<boolean> {
    console.log('🔧 STATIC ADMIN ÇIKARMA TALİMATI:');
    console.log(`1. src/services/RoleService.ts dosyasını aç`);
    console.log(`2. STATIC_ADMINS array'inden kaldır: '${email.toLowerCase()}',`);
    console.log(`3. Uygulamayı yeniden başlat`);
    return false; // UI'da manual talimat görünür
  }

  async getAllAdmins(): Promise<string[]> {
    return RoleConfiguration.getDynamicAdmins();
  }

  isSuperAdmin(email: string): boolean {
    return RoleConfiguration.isSuperAdmin(email);
  }
}

// Factory Pattern - Service instance creation
export class RoleServiceFactory {
  private static instance: IRoleService;

  static getInstance(): IRoleService {
    if (!this.instance) {
      this.instance = new RoleService();
    }
    return this.instance;
  }
} 