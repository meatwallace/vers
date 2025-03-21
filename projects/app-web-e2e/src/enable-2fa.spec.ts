import { expect, test } from '@playwright/test';

test('it enables 2FA for a user', async ({ page }) => {
  await page.setExtraHTTPHeaders({ 'x-forwarded-for': '127.0.0.1' });

  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();

  await expect(page).toHaveURL(/localhost:4000\/login/);

  await page.getByLabel('Email').fill(`e2e-enable-2fa-user@test.com`);
  await page.getByLabel('Password').fill(`password`);
  await page.getByRole('button', { exact: true, name: 'Login' }).click();

  await expect(page).toHaveURL(/localhost:4000\/dashboard/);

  await page.getByRole('link', { name: 'e2e_enable_2fa_user' }).click();

  await expect(page).toHaveURL(/localhost:4000\/profile/);

  await page.getByRole('button', { name: 'Enable 2FA' }).click();

  await expect(page).toHaveURL(/localhost:4000\/profile\/2fa/);

  await page.getByTestId('otp-input').fill('999999');
  await page.getByRole('button', { exact: true, name: 'Submit' }).click();

  await expect(page).toHaveURL(/localhost:4000\/profile/);
  await expect(
    page.getByText('You have enabled two-factor authentication'),
  ).toBeVisible();
});
