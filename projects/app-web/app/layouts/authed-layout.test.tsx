import { afterEach, expect, test } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { drop } from '@mswjs/data';
import { GraphQLError } from 'graphql';
import { graphql } from 'msw';
import { db } from '~/mocks/db.ts';
import { server } from '~/mocks/node.ts';
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
  server.resetHandlers();

  drop(db);
});

test('it redirects to the login route when not authenticated', async () => {
  setupTest({ isAuthed: false });

  await screen.findByText('LOGIN_ROUTE');
});

test('it redirects to the login route when fetching the current user fails', async () => {
  server.use(
    graphql.query('GetCurrentUser', () => {
      throw new GraphQLError('Failed to fetch current user');
    }),
  );

  setupTest({ isAuthed: true, user: { id: 'user_id' } });

  await screen.findByText('LOGIN_ROUTE');
});

test('it renders a log out button that navigates to the logout route when clicked', async () => {
  const { user } = setupTest({ isAuthed: true, user: { id: 'user_id' } });

  const logoutButton = await screen.findByRole('button', { name: 'Logout' });

  await waitFor(() => user.click(logoutButton));

  const loggedOutMessage = await screen.findByText('LOGOUT_ROUTE');

  expect(loggedOutMessage).toBeInTheDocument();
});
