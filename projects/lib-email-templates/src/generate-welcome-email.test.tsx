import { expect, test } from 'vitest';
import { generateWelcomeEmail } from './generate-welcome-email.tsx';

test('it generates a welcome email with the provided configuration', async () => {
  const config = {
    verificationCode: '123456',
    verificationURL: 'https://chrononomicon.com/verification?token=123456',
  };

  const { html, plainText } = await generateWelcomeEmail(config);

  expect(html).include('Welcome to Chrononomicon');
  expect(html).include(config.verificationCode);
  expect(html).include(config.verificationURL);

  expect(plainText).include('WELCOME TO CHRONONOMICON');
  expect(plainText).include(config.verificationCode);
  expect(plainText).include(config.verificationURL);
});
