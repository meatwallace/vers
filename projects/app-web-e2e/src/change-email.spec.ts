import { expect, test } from '@playwright/test';

test('it changes email for a user without 2FA', async ({ page }) => {
  await page.setExtraHTTPHeaders({ 'x-forwarded-for': '127.0.0.1' });

  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();

  await expect(page).toHaveURL(/localhost:4000\/login/);

  await page.getByLabel('Email').fill('e2e-change-email-user@test.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { exact: true, name: 'Login' }).click();

  await expect(page).toHaveURL(/localhost:4000\/dashboard/);

  await page.getByRole('link', { name: 'e2e_change_email_user' }).click();

  await expect(page).toHaveURL(/localhost:4000\/profile/);

  await page.getByRole('link', { exact: true, name: 'Change Email' }).click();

  await expect(page).toHaveURL(/localhost:4000\/profile\/change-email/);

  const newEmail = `new-email-${Date.now()}@test.com`;

  await page.getByLabel('New Email Address').fill(newEmail);
  await page.getByRole('button', { name: 'Change Email' }).click();

  await expect(page).toHaveURL(/localhost:4000\/verify-otp/);

  await page.getByTestId('otp-input').fill('999999');
  await page.getByRole('button', { exact: true, name: 'Verify' }).click();

  await expect(page).toHaveURL(/localhost:4000\/profile$/);
  await expect(page.getByText(newEmail)).toBeVisible();
});
