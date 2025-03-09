import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { Routes } from '~/types.ts';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { Index, loader } from './route.tsx';

interface TestConfig {
  isAuthed: boolean;
}

function setupTest(config: TestConfig) {
  const user = userEvent.setup();

  const IndexStub = createRoutesStub([
    {
      path: '/',
      Component: Index,
      // @ts-expect-error(#35) - react router test types are out of date
      loader: config.isAuthed ? withAuthedUser(loader) : loader,
    },
    {
      path: Routes.Signup,
      Component: () => 'SIGN_UP_ROUTE',
      action: () => null,
    },
    {
      path: Routes.Login,
      Component: () => 'LOG_IN_ROUTE',
      action: () => null,
    },
    {
      path: Routes.Dashboard,
      Component: () => 'DASHBOARD_ROUTE',
    },
  ]);

  render(<IndexStub />);

  return { user };
}

test('it renders a sign up button that navigates to the signup route when clicked', async () => {
  const { user } = setupTest({ isAuthed: false });

  const signUpButton = await screen.findByRole('button', { name: 'Signup' });

  await waitFor(() => user.click(signUpButton));

  const loggedOutMessage = await screen.findByText('SIGN_UP_ROUTE');

  expect(loggedOutMessage).toBeInTheDocument();
});

test('it renders a log in button that navigates to the log in route when clicked', async () => {
  const { user } = setupTest({ isAuthed: false });

  const logInButton = await screen.findByRole('button', { name: 'Log in' });

  await waitFor(() => user.click(logInButton));

  const loggedOutMessage = await screen.findByText('LOG_IN_ROUTE');

  expect(loggedOutMessage).toBeInTheDocument();
});

test('it redirects to the dashboard if the user is logged in', async () => {
  setupTest({ isAuthed: true });

  const dashboardMessage = await screen.findByText('DASHBOARD_ROUTE');

  expect(dashboardMessage).toBeInTheDocument();
});
