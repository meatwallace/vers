import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResetPasswordEmail } from './reset-password-email.tsx';

test('it renders the reset password email with all required elements', () => {
  render(
    <ResetPasswordEmail
      verificationURL="https://example.com/verify"
      otp="123456"
    />,
  );

  const heading = screen.getByRole('heading', { name: /password reset/i });
  const verificationCode = screen.getByText(/123456/);
  const verificationLink = screen.getByRole('link', {
    name: 'https://example.com/verify',
  });

  expect(heading).toBeInTheDocument();
  expect(verificationCode).toBeInTheDocument();
  expect(verificationLink).toBeInTheDocument();
});
