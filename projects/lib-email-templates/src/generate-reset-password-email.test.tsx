import { test, expect } from 'vitest';
import { generateResetPasswordEmail } from './generate-reset-password-email.tsx';

test('it generates a reset password email with the provided configuration', async () => {
  const config = {
    verificationURL: 'https://chrononomicon.com/verify?token=123456',
    otp: '123456',
  };

  const { html, plainText } = await generateResetPasswordEmail(config);

  expect(html).include('Password Reset');
  expect(html).include('https://chrononomicon.com/verify?token=123456');
  expect(html).include('123456');

  expect(plainText).include('PASSWORD RESET');
  expect(plainText).include('https://chrononomicon.com/verify?token=123456');
  expect(plainText).include('123456');
});
