import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResetPasswordEmail } from './reset-password-email.tsx';

test('it renders the reset password email with all required elements', () => {
  render(<ResetPasswordEmail resetURL="https://example.com/reset-password" />);

  const heading = screen.getByRole('heading', {
    name: 'Forgot your password?',
  });
  const resetLink = screen.getByRole('link', {
    name: 'https://example.com/reset-password',
  });

  expect(heading).toBeInTheDocument();
  expect(resetLink).toBeInTheDocument();
});
