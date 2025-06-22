/**
 * useAuth hook tests
 * Authentication hook testing with mocked NextAuth
 */
import { renderHook } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useAuth, useAuthStatus } from '@/hooks/useAuth';

// Mock NextAuth
jest.mock('next-auth/react');
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

// Mock AuthService
jest.mock('@/services/AuthService', () => ({
  AuthServiceFactory: {
    create: () => ({
      login: jest.fn(),
      logout: jest.fn(),
    }),
  },
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return loading state initially', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'loading',
      update: jest.fn(),
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.status).toBe('loading');
    expect(result.current.user).toBeNull();
    expect(typeof result.current.signIn).toBe('function');
    expect(typeof result.current.signOut).toBe('function');
  });

  it('should return authenticated state when user is logged in', () => {
    const mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      image: 'https://example.com/avatar.jpg',
    };

    mockUseSession.mockReturnValue({
      data: { user: mockUser, expires: '2024-12-31' },
      status: 'authenticated',
      update: jest.fn(),
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.status).toBe('authenticated');
    expect(result.current.user).toEqual(mockUser);
    expect(typeof result.current.signIn).toBe('function');
    expect(typeof result.current.signOut).toBe('function');
  });

  it('should return unauthenticated state when user is not logged in', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.status).toBe('unauthenticated');
    expect(result.current.user).toBeNull();
    expect(typeof result.current.signIn).toBe('function');
    expect(typeof result.current.signOut).toBe('function');
  });
});

describe('useAuthStatus Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct loading state', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'loading',
      update: jest.fn(),
    });

    const { result } = renderHook(() => useAuthStatus());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isUnauthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should return correct authenticated state', () => {
    const mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      image: 'https://example.com/avatar.jpg',
    };

    mockUseSession.mockReturnValue({
      data: { user: mockUser, expires: '2024-12-31' },
      status: 'authenticated',
      update: jest.fn(),
    });

    const { result } = renderHook(() => useAuthStatus());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isUnauthenticated).toBe(false);
    expect(result.current.user).toEqual(mockUser);
  });

  it('should return correct unauthenticated state', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    });

    const { result } = renderHook(() => useAuthStatus());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isUnauthenticated).toBe(true);
    expect(result.current.user).toBeNull();
  });
}); 