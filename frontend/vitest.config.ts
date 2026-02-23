import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    environment: 'jsdom',
    exclude: ['node_modules/**'],
    globals: true,
    include: ['tests/unit/**/*.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
  },
})
