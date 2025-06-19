/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'test/setup.ts',
        'src/components/ui/**/*.{ts,tsx}',
        'src/vite-env.d.ts',
        'src/main.tsx',
        'src/router.tsx'
      ],
      include: ['src/**/*.{ts,tsx}'],
    },
  },
}); 