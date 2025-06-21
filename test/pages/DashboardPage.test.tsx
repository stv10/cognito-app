import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DashboardPage from '../../src/pages/DashboardPage';

describe('DashboardPage', () => {
  it('renders the dashboard page with all main elements', () => {
    render(<DashboardPage />);

    // Test main heading and icon
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Protected')).toBeInTheDocument();

    // Test authentication status card
    expect(screen.getByText('Authentication Status')).toBeInTheDocument();
    expect(screen.getByText('Your authentication is working correctly')).toBeInTheDocument();
    expect(screen.getByText('You are successfully authenticated and can access this protected route.')).toBeInTheDocument();

    // Test welcome message card
    expect(screen.getByText('Welcome Message')).toBeInTheDocument();
    expect(screen.getByText("This is a protected route. You can only see this if you're authenticated.")).toBeInTheDocument();
    expect(screen.getByText('The authentication system is working perfectly with shadcn/ui components!')).toBeInTheDocument();

    // Test features card
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText("What's available in this app")).toBeInTheDocument();
  });

  it('renders all feature badges correctly', () => {
    render(<DashboardPage />);

    // Test all feature badges
    expect(screen.getByText('React Router')).toBeInTheDocument();
    expect(screen.getByText('Cognito Auth')).toBeInTheDocument();
    expect(screen.getByText('shadcn/ui')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
    expect(screen.getByText('Vite')).toBeInTheDocument();
  });

  it('renders with correct CSS classes and structure', () => {
    const { container } = render(<DashboardPage />);

    // Test main container structure
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-background', 'pt-16');

    // Test inner container
    const innerContainer = mainContainer.firstChild as HTMLElement;
    expect(innerContainer).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-8');

    // Test content wrapper
    const contentWrapper = innerContainer.firstChild as HTMLElement;
    expect(contentWrapper).toHaveClass('space-y-6');
  });

  it('renders the header section with correct styling', () => {
    const { container } = render(<DashboardPage />);

    // Test header section
    const headerSection = container.querySelector('.flex.items-center.gap-2');
    expect(headerSection).toBeInTheDocument();

    // Test heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-foreground');
    expect(heading).toHaveTextContent('Dashboard');
  });

  it('renders the authentication status card with correct structure', () => {
    const { container } = render(<DashboardPage />);

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
    const { container } = render(<DashboardPage />);

    // Test grid container
    const gridContainer = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-6');
    expect(gridContainer).toBeInTheDocument();
  });

  it('renders all cards with proper card structure', () => {
    const { container } = render(<DashboardPage />);

    // Test that we have multiple cards
    const cards = container.querySelectorAll('[class*="card"]');
    expect(cards.length).toBeGreaterThan(0);

    // Test card headers and content are present
    expect(screen.getByText('Authentication Status')).toBeInTheDocument();
    expect(screen.getByText('Welcome Message')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  it('renders the badge with correct variant', () => {
    render(<DashboardPage />);

    // Test protected badge
    const protectedBadge = screen.getByText('Protected');
    expect(protectedBadge).toBeInTheDocument();
    expect(protectedBadge.closest('div')).toHaveClass('ml-2');
  });

  it('renders all feature badges in the correct layout', () => {
    const { container } = render(<DashboardPage />);

    // Test feature badges - there are 6 feature badges plus 1 "Protected" badge = 7 total
    const featureBadges = screen.getAllByText(/React Router|Cognito Auth|shadcn\/ui|TypeScript|Tailwind CSS|Vite|Protected/);
    expect(featureBadges).toHaveLength(8);

    // Test that badges are in flex containers
    const badgeContainers = container.querySelectorAll('.flex.items-center.gap-2');
    expect(badgeContainers.length).toBeGreaterThan(0);
  });

  it('renders the muted text content correctly', () => {
    render(<DashboardPage />);

    // Test muted text
    const mutedText = screen.getByText('The authentication system is working perfectly with shadcn/ui components!');
    expect(mutedText).toBeInTheDocument();
    expect(mutedText).toHaveClass('text-muted-foreground');
  });

  it('renders the authentication status message with user icon context', () => {
    render(<DashboardPage />);

    // Test the authentication message with icon context
    const authMessage = screen.getByText('You are successfully authenticated and can access this protected route.');
    expect(authMessage).toBeInTheDocument();
    
    // Test that it's in a paragraph with flex classes (indicating icon presence)
    const paragraphElement = authMessage.closest('p');
    expect(paragraphElement).toHaveClass('text-accent-foreground', 'text-sm', 'flex', 'items-center', 'gap-2');
  });
}); 