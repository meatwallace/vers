import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { Routes } from '~/types';
import { Header } from './header';

interface TestConfig {
  name?: string;
  username: string;
}

function setupTest(config: TestConfig) {
  const user = userEvent.setup();

  const HeaderStub = createRoutesStub([
    {
      Component: () => (
        <Header user={{ name: config.name, username: config.username }} />
      ),
      path: '/',
    },
    {
      action: () => null,
      Component: () => 'LOGOUT_ROUTE',
      path: Routes.Logout,
    },
  ]);

  render(<HeaderStub />);

  return { user };
}

test("it displays the user's `name`", () => {
  setupTest({ name: 'John Doe', username: 'test_user' });

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
