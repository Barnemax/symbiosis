import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  fullyParallel: true,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  reporter: 'html',
  retries: process.env.CI ? 2 : 0,
  testDir: './tests/e2e',
  use: {
    // Stack must be running: docker compose up -d
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
})
