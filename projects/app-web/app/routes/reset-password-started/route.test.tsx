import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { Routes } from '~/types.ts';
import { loader, ResetPasswordStarted } from './route.tsx';

interface TestConfig {
  isAuthed?: boolean;
}

function setupTest(config: TestConfig = {}) {
  const user = userEvent.setup();

  const ResetPasswordStartedStub = createRoutesStub([
    {
      Component: ResetPasswordStarted,
      loader: config.isAuthed ? withAuthedUser(loader) : loader,
      path: '/',
    },
    {
      Component: () => 'DASHBOARD_ROUTE',
      path: Routes.Dashboard,
    },
    {
      Component: () => 'FORGOT_PASSWORD_ROUTE',
      path: Routes.ForgotPassword,
    },
  ]);

  render(<ResetPasswordStartedStub />);

  return { user };
}

test('it redirects to the dashboard if the user is authenticated', async () => {
  setupTest({ isAuthed: true });

  const dashboardRoute = await screen.findByText('DASHBOARD_ROUTE');

  expect(dashboardRoute).toBeInTheDocument();
});

test('it renders the reset password started page with a link to request another reset email', async () => {
  setupTest();

  const title = await screen.findByText('Check your email');
  const resetLink = screen.getByRole('link', {
    name: 'try requesting another one',
  });

  expect(title).toBeInTheDocument();
  expect(resetLink).toBeInTheDocument();
  expect(resetLink).toHaveAttribute('href', Routes.ForgotPassword);
});
