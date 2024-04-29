import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LogInButton } from './log-in-button';
import { createRemixStub } from '@remix-run/testing';
import { Routes } from '../types';

function ExpectedRoute() {
  return 'Auth0';
}

function setupTest() {
  const user = userEvent.setup();

  const LogInButtonStub = createRemixStub([
    { path: Routes.Index, Component: LogInButton },
    { path: Routes.AuthAuth0, Component: ExpectedRoute, action: () => null },
  ]);

  render(<LogInButtonStub />);

  return { user };
}

test('it renders a log in button that redirects to auth0 when pressed', async () => {
  const { user } = setupTest();

  const loginButton = await screen.findByRole('button', { name: 'Log in' });

  await waitFor(() => user.click(loginButton));

  const auth0Page = await screen.findByText('Auth0');

  expect(auth0Page).toBeInTheDocument();
});
