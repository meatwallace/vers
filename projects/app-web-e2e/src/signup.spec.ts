import { expect, test } from '@playwright/test';

test('it signs the user up and displays their dashboard', async ({ page }) => {
  await page.setExtraHTTPHeaders({ 'x-forwarded-for': '127.0.0.1' });

  await page.goto('/');
  await page.getByRole('link', { name: 'Signup' }).click();

  await expect(page).toHaveURL(/localhost:4000\/signup/);

  await page.getByLabel('Email').fill(`user_${Date.now()}@example.com`);
  await page.getByRole('button', { exact: true, name: 'Signup' }).click();

  await expect(page).toHaveURL(/localhost:4000\/verify-otp/);

  await page.getByTestId('otp-input').fill('999999');
  await page.getByRole('button', { exact: true, name: 'Verify' }).click();

  await expect(page).toHaveURL(/localhost:4000\/onboarding/);

  await page.getByLabel('Username').fill('john_smith');
  await page.getByLabel('Name', { exact: true }).fill('John Smith');
  await page.getByLabel('Password', { exact: true }).fill('password123!');
  await page.getByLabel('Confirm password').fill('password123!');
  await page.getByLabel('Agree to terms').click();
  await page.getByRole('button', { name: 'Create an account' }).click();

  await expect(page).toHaveURL(/localhost:4000\/dashboard/);

  await expect(page.getByText('john_smith')).toBeVisible();
});
