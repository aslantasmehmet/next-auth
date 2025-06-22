import { UserRole, UserPermissions, ExtendedUser } from '@/types/auth';

// Interface Segregation Principle - Role management interface
export interface IRoleService {
  getUserRole(email: string): Promise<UserRole>;
  getPermissions(role: UserRole): UserPermissions;
  hasPermission(user: ExtendedUser, permission: keyof UserPermissions): boolean;
  isAdmin(user: ExtendedUser): boolean;
  canAccessRoute(user: ExtendedUser, route: string): boolean;
}

// Single Responsibility Principle - Role configuration
class RoleConfiguration {
  private static readonly ADMIN_EMAILS = [
    'admin@example.com',
    'kayra@admin.com', // Demo admin email
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

  static isAdminEmail(email: string): boolean {
    return this.ADMIN_EMAILS.includes(email.toLowerCase());
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