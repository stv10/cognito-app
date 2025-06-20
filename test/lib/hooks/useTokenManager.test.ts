import { renderHook } from '@testing-library/react';
import { useAuth } from 'react-oidc-context';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useTokenManager } from '../../../src/lib/hooks/useTokenManager';
import type { User } from 'oidc-client-ts';
import type { AuthContextProps } from 'react-oidc-context';

// Mock the useAuth hook
vi.mock('react-oidc-context', () => ({
  useAuth: vi.fn(),
}));

describe('useTokenManager', () => {
  beforeEach(() => {
    // Clear all cookies before each test
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=');
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  });

  it('sets cookies when user is authenticated', () => {
    const mockUser = {
      access_token: 'test-access-token',
      id_token: 'test-id-token',
      refresh_token: 'test-refresh-token',
    } as User;

    const mockAuth: Partial<AuthContextProps> = {
      isAuthenticated: true,
      user: mockUser,
      settings: {
        authority: 'https://test.auth.com',
        client_id: 'test-client',
        redirect_uri: 'http://localhost:3000',
      },
    };

    vi.mocked(useAuth).mockReturnValue(mockAuth as AuthContextProps);

    renderHook(() => useTokenManager());

    // Check if cookies are set
    expect(document.cookie).toContain('access_token');
    expect(document.cookie).toContain('id_token');
    expect(document.cookie).toContain('refresh_token');
  });

  it('deletes cookies when user is not authenticated', () => {
    // First set some cookies
    document.cookie = 'access_token=test; path=/';
    document.cookie = 'id_token=test; path=/';
    document.cookie = 'refresh_token=test; path=/';

    const mockAuth: Partial<AuthContextProps> = {
      isAuthenticated: false,
      user: null,
      settings: {
        authority: 'https://test.auth.com',
        client_id: 'test-client',
        redirect_uri: 'http://localhost:3000',
      },
    };

    vi.mocked(useAuth).mockReturnValue(mockAuth as AuthContextProps);

    renderHook(() => useTokenManager());

    // Check if cookies are deleted
    expect(document.cookie).not.toContain('access_token');
    expect(document.cookie).not.toContain('id_token');
    expect(document.cookie).not.toContain('refresh_token');
  });
}); 