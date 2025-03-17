import { expect, test } from '@playwright/test';

test('it logs in a user with 2FA and displays their dashboard', async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({ 'x-forwarded-for': '127.0.0.1' });

  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();

  await expect(page).toHaveURL(/localhost:4000\/login/);

  await page.getByLabel('Email').fill(`e2e-2fa-user@test.com`);
  await page.getByLabel('Password').fill(`password`);
  await page.getByRole('button', { exact: true, name: 'Login' }).click();

  await expect(page).toHaveURL(/localhost:4000\/verify-otp/);

  await page.getByLabel('Code').fill('999999');
  await page.getByRole('button', { exact: true, name: 'Verify' }).click();

  await expect(page).toHaveURL(/localhost:4000\/dashboard/);
  await expect(page.getByText('E2E 2FA User')).toBeVisible();
});
