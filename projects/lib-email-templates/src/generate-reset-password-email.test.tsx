import { expect, test } from 'vitest';
import { generateResetPasswordEmail } from './generate-reset-password-email.tsx';

test('it generates a reset password email with the provided configuration', async () => {
  const config = {
    resetURL: 'https://versidlecom/reset?token=123456',
  };

  const { html, plainText } = await generateResetPasswordEmail(config);

  expect(html).include('Password Reset');
  expect(html).include('https://versidlecom/reset?token=123456');

  expect(plainText).include('PASSWORD RESET');
  expect(plainText).include('https://versidlecom/reset?token=123456');
});
