import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LogOutButton } from './log-out-button';
import { createRemixStub } from '@remix-run/testing';
import { Routes } from '../types';

function ExpectedRoute() {
  return 'Logged out';
}

function setupTest() {
  const user = userEvent.setup();

  const LogOutButtonStub = createRemixStub([
    { path: Routes.Index, Component: LogOutButton },
    { path: Routes.AuthLogout, Component: ExpectedRoute, action: () => null },
  ]);

  render(<LogOutButtonStub />);

  return { user };
}

test('it renders a log out button that redirects to the log out route when pressed', async () => {
  const { user } = setupTest();

  const logOutButton = await screen.findByRole('button', { name: 'Log out' });

  await waitFor(() => user.click(logOutButton));

  const loggedOutMessage = await screen.findByText('Logged out');

  expect(loggedOutMessage).toBeInTheDocument();
});
