import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from './header';
import { createRemixStub } from '@remix-run/testing';
import { Routes } from '../types';

function ExpectedRoute() {
  return 'Logged out';
}

const MOCK_USER = {
  name: 'Test User',
};

function setupTest() {
  const user = userEvent.setup();

  const HeaderButtonStub = createRemixStub([
    { path: Routes.Index, Component: () => <Header user={MOCK_USER} /> },
    { path: Routes.AuthLogout, Component: ExpectedRoute, action: () => null },
  ]);

  render(<HeaderButtonStub />);

  return { user };
}

test('it renders a log out button that redirects to the log out route when pressed', async () => {
  const { user } = setupTest();

  const HeaderButton = await screen.findByRole('button', { name: 'Log out' });

  await waitFor(() => user.click(HeaderButton));

  const loggedOutMessage = await screen.findByText('Logged out');

  expect(loggedOutMessage).toBeInTheDocument();
});
