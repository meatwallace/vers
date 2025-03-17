import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChangeEmailNotificationEmail } from './change-email-notification';

test('it renders a notification email with the correct content', () => {
  render(<ChangeEmailNotificationEmail />);

  const heading = screen.getByText('Email Address Changed');

  expect(heading).toBeInTheDocument();
});
