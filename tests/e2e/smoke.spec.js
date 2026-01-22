const { test, expect } = require('@playwright/test');

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Home|Project Jupiter Evidence Portal/i);
  const content = page.locator('.markdown-section');
  await expect(content).toContainText('Project Jupiter Evidence Portal');
});

test('evidence matrix CSV links are available', async ({ request }) => {
  const csvPaths = [
    '/PROJECT_JUPITER_EVIDENCE_MATRIX.csv',
    '/docs/markdown/PROJECT_JUPITER_EVIDENCE_MATRIX.csv',
    '/docs/markdown/evidence_matrix.csv'
  ];

  for (const path of csvPaths) {
    const response = await request.get(path);
    expect(response.ok()).toBeTruthy();
  }
});
