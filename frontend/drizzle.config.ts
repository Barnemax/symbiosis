import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dbCredentials: {
    url: process.env.AUTH_DATABASE_URL ?? 'postgres://symbiosis:symbiosis@localhost:5432/symbiosis',
  },
  dialect: 'postgresql',
  out: './drizzle',
  schema: './lib/auth-schema.ts',
  // Only manage auth tables — leaves Symfony/Doctrine tables untouched
  tablesFilter: ['user', 'session', 'account', 'verification'],
})
