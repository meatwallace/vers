import { test, expect } from '@playwright/test';
import { env } from './env';

test('it signs the user in and welcomes them', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL(/chrononomicon\.us\.auth0\.com\/u\/login/);

  await page.getByLabel('Email address').fill(env.TEST_USER_EMAIL);
  await page.getByLabel('Password').fill(env.TEST_USER_PASSWORD);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();

  await expect(page).toHaveURL(/localhost:4000/);

  await expect(page.getByText('John')).toBeVisible();
});
