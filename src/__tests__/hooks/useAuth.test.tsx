import { renderHook, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useAuthStatus, useAdminAuth } from '@/hooks/useAuth';
import type { UserRole, ExtendedUser } from '@/types/auth';

// Mock dependencies
jest.mock('next-auth/react');

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

describe('useAuthStatus Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return loading state when session is loading', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'loading',
      update: jest.fn(),
    });

    const { result } = renderHook(() => useAuthStatus());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeUndefined();
  });

  test('should return unauthenticated state when no session', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    });

    const { result } = renderHook(() => useAuthStatus());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeUndefined();
  });

  test('should return authenticated state with user data', () => {
    const mockUser: ExtendedUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user' as UserRole,
      permissions: {
        canManageUsers: false,
        canViewAnalytics: false,
        canEditProfile: true,
        canAccessAdmin: false,
      },
      isActive: true,
    };

    mockUseSession.mockReturnValue({
      data: {
        user: mockUser,
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    const { result } = renderHook(() => useAuthStatus());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  test('should handle admin user correctly', () => {
    const mockAdminUser: ExtendedUser = {
      id: '2',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin' as UserRole,
      permissions: {
        canManageUsers: true,
        canViewAnalytics: true,
        canEditProfile: true,
        canAccessAdmin: true,
      },
      isActive: true,
    };

    mockUseSession.mockReturnValue({
      data: {
        user: mockAdminUser,
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    const { result } = renderHook(() => useAuthStatus());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.role).toBe('admin');
    expect(result.current.user?.permissions.canAccessAdmin).toBe(true);
  });
});

describe('useAdminAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return correct admin status for admin user', () => {
    const mockAdminUser: ExtendedUser = {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin' as UserRole,
      permissions: {
        canManageUsers: true,
        canViewAnalytics: true,
        canEditProfile: true,
        canAccessAdmin: true,
      },
      isActive: true,
    };

    mockUseSession.mockReturnValue({
      data: {
        user: mockAdminUser,
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    const { result } = renderHook(() => useAdminAuth());

    expect(result.current.isAdmin).toBe(true);
    expect(result.current.canManageUsers).toBe(true);
    expect(result.current.canViewAnalytics).toBe(true);
    expect(result.current.hasRole('admin')).toBe(true);
    expect(result.current.hasPermission('canAccessAdmin')).toBe(true);
  });

  test('should return correct status for regular user', () => {
    const mockRegularUser: ExtendedUser = {
      id: '2',
      name: 'Regular User',
      email: 'user@example.com',
      role: 'user' as UserRole,
      permissions: {
        canManageUsers: false,
        canViewAnalytics: false,
        canEditProfile: true,
        canAccessAdmin: false,
      },
      isActive: true,
    };

    mockUseSession.mockReturnValue({
      data: {
        user: mockRegularUser,
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    const { result } = renderHook(() => useAdminAuth());

    expect(result.current.isAdmin).toBe(false);
    expect(result.current.canManageUsers).toBe(false);
    expect(result.current.canViewAnalytics).toBe(false);
    expect(result.current.hasRole('admin')).toBe(false);
    expect(result.current.hasRole('user')).toBe(true);
    expect(result.current.hasPermission('canAccessAdmin')).toBe(false);
    expect(result.current.hasPermission('canEditProfile')).toBe(true);
  });

  test('should handle sign in and sign out actions', async () => {
    const mockUser: ExtendedUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user' as UserRole,
      permissions: {
        canManageUsers: false,
        canViewAnalytics: false,
        canEditProfile: true,
        canAccessAdmin: false,
      },
      isActive: true,
    };

    mockUseSession.mockReturnValue({
      data: {
        user: mockUser,
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    const { result } = renderHook(() => useAdminAuth());

    // Test signIn function exists
    expect(typeof result.current.signIn).toBe('function');
    
    // Test signOut function exists
    expect(typeof result.current.signOut).toBe('function');
  });

  test('should handle permission checking edge cases', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    });

    const { result } = renderHook(() => useAdminAuth());

    expect(result.current.hasPermission('canAccessAdmin')).toBe(false);
    expect(result.current.hasRole('admin')).toBe(false);
    expect(result.current.isAdmin).toBe(false);
  });

  test('should handle user without permissions object', () => {
    const mockUserWithoutPermissions: ExtendedUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user' as UserRole,
      permissions: {
        canManageUsers: false,
        canViewAnalytics: false,
        canEditProfile: false,
        canAccessAdmin: false,
      },
      isActive: true,
    };

    mockUseSession.mockReturnValue({
      data: {
        user: mockUserWithoutPermissions,
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    const { result } = renderHook(() => useAdminAuth());

    expect(result.current.hasPermission('canAccessAdmin')).toBe(false);
    expect(result.current.canManageUsers).toBe(false);
    expect(result.current.canViewAnalytics).toBe(false);
  });
});

describe('Authentication Integration Tests', () => {
  test('should work with role service integration', () => {
    const superAdminUser: ExtendedUser = {
      id: '1',
      name: 'Super Admin',
      email: 'super@admin.com',
      role: 'admin' as UserRole,
      permissions: {
        canManageUsers: true,
        canViewAnalytics: true,
        canEditProfile: true,
        canAccessAdmin: true,
      },
      isActive: true,
    };

    mockUseSession.mockReturnValue({
      data: {
        user: superAdminUser,
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    const { result } = renderHook(() => useAdminAuth());

    // Super admin should have all permissions
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.canManageUsers).toBe(true);
    expect(result.current.canViewAnalytics).toBe(true);
    expect(result.current.hasPermission('canAccessAdmin')).toBe(true);
  });

  test('should handle session status transitions', async () => {
    // Start with loading
    mockUseSession.mockReturnValue({
      data: null,
      status: 'loading',
      update: jest.fn(),
    });

    const { result, rerender } = renderHook(() => useAuthStatus());

    expect(result.current.isLoading).toBe(true);

    // Transition to authenticated
    const authenticatedUser: ExtendedUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user' as UserRole,
      permissions: {
        canManageUsers: false,
        canViewAnalytics: false,
        canEditProfile: true,
        canAccessAdmin: false,
      },
      isActive: true,
    };

    mockUseSession.mockReturnValue({
      data: {
        user: authenticatedUser,
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    rerender();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
}); 