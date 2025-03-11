import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExistingAccountEmail } from './existing-account-email.tsx';

test('it renders the existing account email with all required elements', () => {
  render(<ExistingAccountEmail email={'test@example.com'} />);

  const heading = screen.getByRole('heading', {
    name: /you already have an account/i,
  });
  const emailText = screen.getByText(/test@example.com/i);
  const resetButton = screen.getByRole('link', { name: /reset password/i });

  expect(heading).toBeInTheDocument();
  expect(emailText).toBeInTheDocument();
  expect(resetButton).toBeInTheDocument();
  expect(resetButton).toHaveAttribute(
    'href',
    'https://versidlecom/forgot-password',
  );
});
