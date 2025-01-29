import { test, expect } from 'vitest';
import { generateWelcomeEmail } from './generate-welcome-email.tsx';

test('it generates a welcome email with the provided configuration', async () => {
  const config = {
    onboardingURL: 'https://chrononomicon.com/onboarding?token=123456',
    otp: '123456',
  };

  const { html, plainText } = await generateWelcomeEmail(config);

  expect(html).include('Welcome to Chrononomicon');
  expect(html).include(config.otp);
  expect(html).include(config.onboardingURL);

  expect(plainText).include('WELCOME TO CHRONONOMICON');
  expect(plainText).include(config.otp);
  expect(plainText).include(config.onboardingURL);
});
