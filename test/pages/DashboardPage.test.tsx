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
  });

  it('renders the dashboard page with all main elements', () => {
    render(
      <BrowserRouter>
        <DashboardIndex />
      </BrowserRouter>
    );

    // Test main heading and icon
    expect(screen.getByText('Authentication Status')).toBeInTheDocument();
    expect(screen.getByText('Your authentication is working correctly')).toBeInTheDocument();
    expect(screen.getByText('You are successfully authenticated and can access this protected route.')).toBeInTheDocument();

    // Test welcome message card
    expect(screen.getByText('Welcome Message')).toBeInTheDocument();
    expect(screen.getByText("This is a protected route. You can only see this if you're authenticated.")).toBeInTheDocument();
    expect(screen.getByText('The authentication system is working perfectly with shadcn/ui components!')).toBeInTheDocument();

    // Test features card
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
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

  it('renders the authentication status card with correct structure', () => {
    const { container } = render(
      <BrowserRouter>
        <DashboardIndex />
      </BrowserRouter>
    );

    // Test card structure
    const authCard = container.querySelector('.bg-accent');
    expect(authCard).toBeInTheDocument();

    // Test card content
    const cardContent = screen.getByText('You are successfully authenticated and can access this protected route.');
    expect(cardContent).toBeInTheDocument();
    
    // Test the paragraph element that contains the text
    const paragraphElement = cardContent.closest('p');
    expect(paragraphElement).toHaveClass('text-accent-foreground', 'text-sm', 'flex', 'items-center', 'gap-2');
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
    expect(screen.getByText('Authentication Status')).toBeInTheDocument();
    expect(screen.getByText('Welcome Message')).toBeInTheDocument();
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
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

    // Test muted text
    const mutedText = screen.getByText('The authentication system is working perfectly with shadcn/ui components!');
    expect(mutedText).toBeInTheDocument();
    expect(mutedText).toHaveClass('text-muted-foreground');
  });

  it('renders the authentication status message with user icon context', () => {
    render(
      <BrowserRouter>
        <DashboardIndex />
      </BrowserRouter>
    );

    // Test the authentication message with icon context
    const authMessage = screen.getByText('You are successfully authenticated and can access this protected route.');
    expect(authMessage).toBeInTheDocument();
    
    // Test that it's in a paragraph with flex classes (indicating icon presence)
    const paragraphElement = authMessage.closest('p');
    expect(paragraphElement).toHaveClass('text-accent-foreground', 'text-sm', 'flex', 'items-center', 'gap-2');
  });
}); 