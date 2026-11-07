import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: true,
    // Only this repo's tests. Without this, `aqe init` installs fixture tests
    // under .claude/ and they join every run.
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // Coverage is about the checkout app, not the tooling installed beside it.
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'tests/setup.ts',
        '.claude/**',
        '.agentic-qe/**',
        '**/*.config.{js,ts}',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
