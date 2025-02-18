import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PasswordChangedEmail } from './password-changed-email.tsx';

test('it renders the password changed email with all required elements', () => {
  render(<PasswordChangedEmail email="test@example.com" />);

  const heading = screen.getByRole('heading', { name: /password changed/i });
  const emailText = screen.getByText(/test@example\.com/);

  expect(heading).toBeInTheDocument();
  expect(emailText).toBeInTheDocument();
});
