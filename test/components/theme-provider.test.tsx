import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, useTheme } from '../../src/components/theme-provider';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Test component to use the theme hook
const TestComponent = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={() => setTheme('light')} data-testid="set-light">
        Light
      </button>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">
        Dark
      </button>
      <button onClick={() => setTheme('system')} data-testid="set-system">
        System
      </button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset document classes
    document.documentElement.classList.remove('light', 'dark');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default theme when no localStorage value exists', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
    });

    it('should initialize with theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });

    it('should initialize with custom default theme', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });

    it('should use custom storage key', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      render(
        <ThemeProvider storageKey="custom-theme-key">
          <TestComponent />
        </ThemeProvider>
      );

      expect(localStorageMock.getItem).toHaveBeenCalledWith('custom-theme-key');
    });
  });

  describe('theme switching', () => {
    it('should switch to light theme and update localStorage', async () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const lightButton = screen.getByTestId('set-light');
      
      await act(async () => {
        lightButton.click();
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('vite-ui-theme', 'light');
    });

    it('should switch to dark theme and update localStorage', async () => {
      localStorageMock.getItem.mockReturnValue('light');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const darkButton = screen.getByTestId('set-dark');
      
      await act(async () => {
        darkButton.click();
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('vite-ui-theme', 'dark');
    });

    it('should switch to system theme and update localStorage', async () => {
      localStorageMock.getItem.mockReturnValue('light');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const systemButton = screen.getByTestId('set-system');
      
      await act(async () => {
        systemButton.click();
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('vite-ui-theme', 'system');
    });
  });

  describe('DOM class management', () => {
    it('should add light class to document root when theme is light', () => {
      localStorageMock.getItem.mockReturnValue('light');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should add dark class to document root when theme is dark', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });

    it('should add system theme class when theme is system and prefers dark', () => {
      localStorageMock.getItem.mockReturnValue('system');
      
      // Mock prefers dark
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });

    it('should add light theme class when theme is system and prefers light', () => {
      localStorageMock.getItem.mockReturnValue('system');
      
      // Mock prefers light
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: false, // prefers light
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should remove existing classes before adding new ones', async () => {
      // Start with dark theme
      localStorageMock.getItem.mockReturnValue('dark');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('dark')).toBe(true);

      // Switch to light theme by clicking the button
      const lightButton = screen.getByTestId('set-light');
      
      await act(async () => {
        lightButton.click();
      });

      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('useTheme hook', () => {
    it('should throw error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Create a component that uses useTheme without ThemeProvider
      const TestComponentWithoutProvider = () => {
        const { theme } = useTheme();
        return <div>{theme}</div>;
      };
      
      let error: unknown;
      try {
        render(<TestComponentWithoutProvider />);
      } catch (e: unknown) {
        error = e;
      }
      expect(error).toBeDefined();
      expect((error as Error).message).toBe('useTheme must be used within a ThemeProvider');
      
      consoleSpy.mockRestore();
    });

    it('should provide theme and setTheme function when used within ThemeProvider', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('set-light')).toBeInTheDocument();
      expect(screen.getByTestId('set-dark')).toBeInTheDocument();
      expect(screen.getByTestId('set-system')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle invalid localStorage values gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid-theme');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // The component accepts any string as a valid theme, so it should use the invalid value
      expect(screen.getByTestId('current-theme')).toHaveTextContent('invalid-theme');
    });

    it('should handle empty string from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Should fall back to default theme
      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
    });

    it('should handle undefined from localStorage', () => {
      localStorageMock.getItem.mockReturnValue(undefined);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Should fall back to default theme
      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
    });
  });
}); 