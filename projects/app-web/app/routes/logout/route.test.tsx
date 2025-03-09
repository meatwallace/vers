import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { createRoutesStub, Form } from 'react-router';
import { Routes } from '~/types.ts';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { db } from '~/mocks/db.ts';
import { drop } from '@mswjs/data';
import { server } from '~/mocks/node.ts';
import { graphql } from 'msw';
import { loader, action } from './route.tsx';

interface TestConfig {
  initialPath?: string;
  sessionID?: string;
}

function setupTest(config: TestConfig) {
  const user = userEvent.setup();

  const LogoutStub = createRoutesStub([
    {
      path: Routes.Dashboard,
      Component: () => (
        <Form action={Routes.Logout} method="post">
          <button type="submit">Logout</button>
        </Form>
      ),
    },
    {
      path: Routes.Logout,
      Component: () => 'LOGOUT_ROUTE',
      loader,
      // @ts-expect-error(#35) - react router test types are out of date
      action: withAuthedUser(action, { sessionID: config.sessionID }),
    },
    {
      path: Routes.Index,
      Component: () => 'INDEX_ROUTE',
    },
  ]);

  render(
    <LogoutStub initialEntries={[config.initialPath ?? Routes.Dashboard]} />,
  );

  return { user };
}

afterEach(() => {
  drop(db);

  server.resetHandlers();
});

test('it redirects to index page and deletes the session', async () => {
  const { user } = setupTest({ sessionID: 'test-session-id' });

  const logoutButton = screen.getByRole('button', { name: 'Logout' });

  await user.click(logoutButton);

  const indexRoute = await screen.findByText('INDEX_ROUTE');

  expect(indexRoute).toBeInTheDocument();

  const deletedSession = db.session.findFirst({
    where: {
      id: {
        equals: 'test-session-id',
      },
    },
  });

  expect(deletedSession).toBeNull();
});

test('it still redirects to index page when session deletion fails', async () => {
  server.use(
    graphql.mutation('DeleteSession', () => {
      throw new Error('Internal server error');
    }),
  );

  const { user } = setupTest({});

  const logoutButton = screen.getByRole('button', { name: 'Logout' });

  await user.click(logoutButton);

  const indexRoute = await screen.findByText('INDEX_ROUTE');

  expect(indexRoute).toBeInTheDocument();
});

test('it redirects to the index page if directly loaded', async () => {
  setupTest({ initialPath: Routes.Logout });

  const indexRoute = await screen.findByText('INDEX_ROUTE');

  expect(indexRoute).toBeInTheDocument();
});
