import React from 'react';
import { render, screen } from '@testing-library/react';
import { useAuth } from 'react-oidc-context';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import HomePage from '../../src/pages/HomePage';
import type { User } from 'oidc-client-ts';
import type { AuthContextProps } from 'react-oidc-context';
import type { UserManagerEvents } from 'oidc-client-ts';
import '@testing-library/jest-dom';

// Mock the useAuth hook
vi.mock('react-oidc-context', () => ({
  useAuth: vi.fn(),
}));

describe('HomePage', () => {
  it('renders login screen when user is not authenticated', () => {
    // Mock the useAuth hook to return not authenticated
    const mockAuth: Partial<AuthContextProps> = {
      isAuthenticated: false,
      signinRedirect: vi.fn(),
      user: null,
      settings: {
        authority: 'https://test.auth.com',
        client_id: 'test-client',
        redirect_uri: 'http://localhost:3000',
      },
      events: {
        addUserLoaded: vi.fn(),
        addUserUnloaded: vi.fn(),
        addSilentRenewError: vi.fn(),
        addUserSignedOut: vi.fn(),
      } as unknown as UserManagerEvents,
    };

    vi.mocked(useAuth).mockReturnValue(mockAuth as AuthContextProps);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome to Cognito App')).toBeInTheDocument();
    expect(screen.getByText('Please sign in to continue')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders welcome screen with dashboard link when user is authenticated', () => {
    // Mock the useAuth hook to return authenticated
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
      events: {
        addUserLoaded: vi.fn(),
        addUserUnloaded: vi.fn(),
        addSilentRenewError: vi.fn(),
        addUserSignedOut: vi.fn(),
      } as unknown as UserManagerEvents,
    };

    vi.mocked(useAuth).mockReturnValue(mockAuth as AuthContextProps);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to Dashboard' })).toBeInTheDocument();
  });
}); 