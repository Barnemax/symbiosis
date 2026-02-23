import { expect, test } from '@playwright/test'

// Requires the full Docker stack to be running: docker compose up -d
// Seed the DB first: docker compose exec php bin/console doctrine:fixtures:load

test.describe('public species browser', () => {
  test('home page loads with kingdom navigation', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/nature/i)
    await expect(page.getByRole('link', { name: /birds/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /trees/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /fungi/i })).toBeVisible()
  })

  test('birds page shows a list of species', async ({ page }) => {
    await page.goto('/birds')
    // Expect at least one species card/link
    const speciesLinks = page.getByRole('link').filter({ hasText: /\w+ \w+/ })
    await expect(speciesLinks.first()).toBeVisible()
  })

  test('clicking a species navigates to its detail page', async ({ page }) => {
    await page.goto('/birds')
    const firstSpecies = page.getByRole('main').getByRole('link').first()
    const name = await firstSpecies.textContent()
    await firstSpecies.click()
    // Detail page should mention the species name somewhere
    await expect(page.getByRole('main')).toContainText(name?.trim() ?? '')
  })
})

test.describe('admin login', () => {
  test('redirects to login when accessing /admin unauthenticated', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('shows error on wrong password', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText(/incorrect password/i)).toBeVisible()
  })
})
