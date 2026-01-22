const { test, expect } = require('@playwright/test');

test('docsify shell renders with sidebar and search', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.sidebar');
  await expect(page.locator('.sidebar')).toContainText('START HERE');

  const searchInput = page.locator('input[placeholder="Search documents..."]');
  await expect(searchInput).toBeVisible();
});

test('can navigate to consolidated report route', async ({ page }) => {
  await page.goto('/#/docs/markdown/CONSOLIDATED_PUBLIC_REPORT');
  await page.waitForSelector('.markdown-section');
  await expect(page).toHaveURL(/CONSOLIDATED_PUBLIC_REPORT/);
  await expect(page.locator('.markdown-section')).toContainText(/Project Jupiter Accountability Report/i);
});

test('analytics dashboard login view loads', async ({ page }) => {
  await page.goto('/analytics-dashboard.html');
  await expect(page).toHaveTitle(/Analytics Dashboard/i);

  await page.fill('#password', 'jupiter2026');
  await page.click('button:has-text("Access Dashboard")');

  await expect(page.locator('#dashboard')).toBeVisible();
  await expect(page.locator('header')).toContainText('Analytics Dashboard');
  await expect(page.locator('button:has-text("Refresh")')).toBeVisible();
});
