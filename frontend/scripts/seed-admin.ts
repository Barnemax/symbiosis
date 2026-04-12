/**
 * Seed the initial admin user.
 *
 * Usage:
 *   npx tsx scripts/seed-admin.ts
 *
 * Requires AUTH_DATABASE_URL, BETTER_AUTH_SECRET, and ADMIN_SEED_PASSWORD in .env.local
 */
import { drizzle } from 'drizzle-orm/node-postgres'
import { eq } from 'drizzle-orm'
import { auth } from '../lib/auth'
import { user } from '../lib/auth-schema'

const DATABASE_URL = process.env.AUTH_DATABASE_URL ?? 'postgres://symbiosis:symbiosis@localhost:5432/symbiosis'
const EMAIL = process.env.ADMIN_EMAIL ?? 'admin@symbiosis.io'
const PASSWORD = process.env.ADMIN_SEED_PASSWORD

async function main(): Promise<void> {
  if (!PASSWORD) {
    console.error('Set ADMIN_SEED_PASSWORD env var')
    process.exit(1)
  }

  const db = drizzle(DATABASE_URL)

  // Check if admin already exists
  const existing = await db.select().from(user).where(eq(user.email, EMAIL)).limit(1)
  if (existing.length > 0) {
    if (existing[0].role === 'admin') {
      console.log(`Admin user already exists: ${EMAIL}`)
      process.exit(0)
    }
    // User exists but isn't admin yet — promote
    await db.update(user).set({ role: 'admin' }).where(eq(user.email, EMAIL))
    console.log(`Promoted existing user to admin: ${EMAIL}`)
    process.exit(0)
  }

  // Create the user via Better Auth (handles password hashing)
  let userId: string
  try {
    const res = await auth.api.signUpEmail({
      body: { email: EMAIL, name: 'Admin', password: PASSWORD },
    })
    userId = res.user.id
  } catch {
    console.error('Failed to create user')
    process.exit(1)
  }

  // Promote to admin directly in the database
  await db.update(user).set({ role: 'admin' }).where(eq(user.id, userId))

  console.log(`Admin created: ${EMAIL}`)
  process.exit(0)
}

main()
