import { afterEach, expect, test } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { drop } from '@mswjs/data';
import { db } from '~/mocks/db.ts';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { withRouteProps } from '~/test-utils/with-route-props.tsx';
import { Routes } from '~/types.ts';
import { AuthedLayout, loader } from './authed-layout.tsx';

interface TestConfig {
  isAuthed: boolean;
  user?: {
    id?: string;
    name?: string;
  };
}

function setupTest(config: TestConfig) {
  const user = userEvent.setup();

  const DashboardStub = createRoutesStub([
    {
      Component: withRouteProps(AuthedLayout),
      // @ts-expect-error(#35) - react router test types are out of date
      loader: config.isAuthed
        ? withAuthedUser(loader, { user: config.user })
        : loader,
      path: '/',
    },
    {
      action: () => null,
      Component: () => 'LOGOUT_ROUTE',
      path: Routes.Logout,
    },
    {
      Component: () => 'LOGIN_ROUTE',
      path: Routes.Login,
    },
  ]);

  render(<DashboardStub />);

  return { user };
}

afterEach(() => {
  drop(db);
});

test('it redirects to the login route when not authenticated', async () => {
  setupTest({ isAuthed: false });

  await screen.findByText('LOGIN_ROUTE');
});

test('it renders a log out button that navigates to the logout route when clicked', async () => {
  const { user } = setupTest({ isAuthed: true, user: { id: 'user_id' } });

  const logOutButton = await screen.findByRole('button', { name: 'Log out' });

  await waitFor(() => user.click(logOutButton));

  const loggedOutMessage = await screen.findByText('LOGOUT_ROUTE');

  expect(loggedOutMessage).toBeInTheDocument();
});
