import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { render, screen, waitFor } from '@testing-library/react';
import { Header } from './header';
import { Routes } from '~/types';

interface TestConfig {
  username: string;
  name?: string;
}

function setupTest(config: TestConfig) {
  const user = userEvent.setup();

  const HeaderStub = createRoutesStub([
    {
      path: '/',
      Component: () => (
        <Header user={{ username: config.username, name: config.name }} />
      ),
    },
    {
      path: Routes.Logout,
      Component: () => 'LOGOUT_ROUTE',
      action: () => null,
    },
  ]);

  render(<HeaderStub />);

  return { user };
}

test("it displays the user's `name`", () => {
  setupTest({ username: 'test_user', name: 'John Doe' });

  expect(screen.getByText('John Doe')).toBeInTheDocument();
});

test("it displays the user's `username` when `name` is not provided", () => {
  setupTest({ username: 'test_user' });

  expect(screen.getByText('test_user')).toBeInTheDocument();
});

test('it renders a log out button that redirects to the log out route when pressed', async () => {
  const { user } = setupTest({ username: 'test_user' });

  const HeaderButton = await screen.findByRole('button', { name: 'Log out' });

  await waitFor(() => user.click(HeaderButton));

  const loggedOutMessage = await screen.findByText('LOGOUT_ROUTE');

  expect(loggedOutMessage).toBeInTheDocument();
});
