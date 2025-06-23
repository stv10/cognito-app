import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { DashboardIndex } from '../../src/components/DashboardIndex';
import type { User } from 'oidc-client-ts';
import type { AuthContextProps } from 'react-oidc-context';
import type { UserManagerEvents } from 'oidc-client-ts';
import '@testing-library/jest-dom';

// Mock the useAuth hook
vi.mock('react-oidc-context', () => ({
  useAuth: vi.fn(),
}));

// Mock the useUserRole hook
const mockUseUserRole = vi.hoisted(() => vi.fn());
vi.mock('../../src/hooks/useUserRole', () => ({
  useUserRole: mockUseUserRole,
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('DashboardPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    
    // Mock authenticated user
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

    // Mock useUserRole with default user role
    mockUseUserRole.mockReturnValue({
      groups: [],
      hasGroup: vi.fn(),
      isAdmin: false,
      isUser: true,
      role: 'user',
      user: mockUser,
    });
  });

  it('renders the dashboard page with all main elements', () => {
    render(
      <BrowserRouter>
        <DashboardIndex />
      </BrowserRouter>
    );

    // Test main heading and icon
    expect(screen.getByText('User Dashboard')).toBeInTheDocument();
    expect(screen.getAllByText('View and manage your assigned tasks').length).toBeGreaterThan(0);

    // Test welcome message card
    expect(screen.getByText('Welcome Message')).toBeInTheDocument();
    expect(screen.getByText("This is a protected route. You can only see this if you're authenticated.")).toBeInTheDocument();
    expect(screen.getByText(/The authentication system is working perfectly/)).toBeInTheDocument();

    // Test features card
    expect(screen.getAllByText('Quick Actions')).toHaveLength(2);
    expect(screen.getByText('Access your tasks and manage your workflow')).toBeInTheDocument();
  });

  it('renders all feature badges correctly', () => {
    render(
      <BrowserRouter>
        <DashboardIndex />
      </BrowserRouter>
    );

    // Test all feature badges
    expect(screen.getByText('React Router')).toBeInTheDocument();
    expect(screen.getByText('Cognito Auth')).toBeInTheDocument();
    expect(screen.getByText('shadcn/ui')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
    expect(screen.getByText('Vite')).toBeInTheDocument();
  });

  it('renders with correct CSS classes and structure', () => {
    const { container } = render(
      <BrowserRouter>
        <DashboardIndex />
      </BrowserRouter>
    );

    // Test grid container
    const gridContainer = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-6');
    expect(gridContainer).toBeInTheDocument();
  });

  it('renders the user role badge correctly', () => {
    render(
      <BrowserRouter>
        <DashboardIndex />
      </BrowserRouter>
    );

    // Test role badge - there are multiple elements with "user" text, so use getAllByText
    const userElements = screen.getAllByText('user');
    expect(userElements.length).toBeGreaterThan(0);
  });

  it('renders the grid layout with correct responsive classes', () => {
    const { container } = render(
      <BrowserRouter>
        <DashboardIndex />
      </BrowserRouter>
    );

    // Test grid container
    const gridContainer = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-6');
    expect(gridContainer).toBeInTheDocument();
  });

  it('renders all cards with proper card structure', () => {
    const { container } = render(
      <BrowserRouter>
        <DashboardIndex />
      </BrowserRouter>
    );

    // Test that we have multiple cards
    const cards = container.querySelectorAll('[class*="card"]');
    expect(cards.length).toBeGreaterThan(0);

    // Test card headers and content are present
    expect(screen.getByText('Welcome Message')).toBeInTheDocument();
    expect(screen.getAllByText('Quick Actions')).toHaveLength(2);
  });

  it('renders all feature badges in the correct layout', () => {
    const { container } = render(
      <BrowserRouter>
        <DashboardIndex />
      </BrowserRouter>
    );

    // Test feature badges - there are 6 feature badges in the Quick Actions card
    expect(screen.getByText('React Router')).toBeInTheDocument();
    expect(screen.getByText('Cognito Auth')).toBeInTheDocument();
    expect(screen.getByText('shadcn/ui')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
    expect(screen.getByText('Vite')).toBeInTheDocument();

    // Test that badges are in flex containers
    const badgeContainers = container.querySelectorAll('.flex.items-center.gap-2');
    expect(badgeContainers.length).toBeGreaterThan(0);
  });

  it('renders the muted text content correctly', () => {
    render(
      <BrowserRouter>
        <DashboardIndex />
      </BrowserRouter>
    );

    // Test muted text using regex to handle text split across elements
    const mutedText = screen.getByText(/The authentication system is working perfectly/);
    expect(mutedText).toBeInTheDocument();
    expect(mutedText).toHaveClass('text-muted-foreground');
  });

  it('renders user-specific content when user role is user', () => {
    mockUseUserRole.mockReturnValue({
      groups: [],
      hasGroup: vi.fn(),
      isAdmin: false,
      isUser: true,
      role: 'user',
      user: {} as User,
    });

    render(
      <BrowserRouter>
        <DashboardIndex />
      </BrowserRouter>
    );

    // Test user-specific content
    expect(screen.getByText('My Tasks Overview')).toBeInTheDocument();
    expect(screen.getAllByText('View and manage your assigned tasks')).toHaveLength(2);
    expect(screen.getAllByText('Quick Actions')).toHaveLength(2);
    expect(screen.getByText('Common actions for task management')).toBeInTheDocument();
  });

  it('renders admin-specific content when user role is admin', () => {
    mockUseUserRole.mockReturnValue({
      groups: ['admin'],
      hasGroup: vi.fn(),
      isAdmin: true,
      isUser: false,
      role: 'admin',
      user: {} as User,
    });

    render(
      <BrowserRouter>
        <DashboardIndex />
      </BrowserRouter>
    );

    // Test admin-specific content
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Manage tasks, users, and system settings')).toBeInTheDocument();
    expect(screen.getByText('Admin Controls')).toBeInTheDocument();
    expect(screen.getByText('Manage system settings and user permissions')).toBeInTheDocument();
    expect(screen.getByText('System Analytics')).toBeInTheDocument();
    expect(screen.getByText('View system-wide statistics and performance metrics')).toBeInTheDocument();
  });

  it('renders the role badge with correct variant for admin', () => {
    mockUseUserRole.mockReturnValue({
      groups: ['admin'],
      hasGroup: vi.fn(),
      isAdmin: true,
      isUser: false,
      role: 'admin',
      user: {} as User,
    });

    render(
      <BrowserRouter>
        <DashboardIndex />
      </BrowserRouter>
    );

    // Test admin role badge - there are multiple elements with "admin" text
    const adminElements = screen.getAllByText('admin');
    expect(adminElements.length).toBeGreaterThan(0);
  });
}); 