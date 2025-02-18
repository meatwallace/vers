import invariant from 'tiny-invariant';
import { afterEach, expect, test } from 'vitest';
import { createRoutesStub, LoaderFunctionArgs } from 'react-router';
import { render, screen } from '@testing-library/react';
import { GraphQLClient } from 'graphql-request';
import { drop } from '@mswjs/data';
import { db } from '~/mocks/db.ts';
import { authSessionStorage } from '~/session/auth-session-storage.server.ts';
import {
  SESSION_KEY_AUTH_ACCESS_TOKEN,
  SESSION_KEY_AUTH_SESSION_ID,
} from '~/session/consts.ts';
import { Routes } from '~/types.ts';
import { logout } from './logout.server.ts';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';

type TestConfig = {
  sessionID?: string;
  userID?: string;
  redirectTo?: string;
};

let setCookieHeader: null | string = null;

const _Response = globalThis.Response;

// stub the global Response object so we can capture the cookie header
vi.stubGlobal(
  'Response',
  vi.fn((body?: BodyInit | null, init?: ResponseInit) => {
    if (init?.headers instanceof Headers) {
      setCookieHeader = init.headers.get('set-cookie');
    }

    return new _Response(body, init);
  }),
);

async function setupTest(config: Partial<TestConfig> = {}) {
  const client = new GraphQLClient('http://localhost:3000/graphql');
  const loader = async ({ request }: LoaderFunctionArgs) => {
    await logout(request, {
      client,
      redirectTo: config.redirectTo,
    });
  };

  const TestRoutesStub = createRoutesStub([
    {
      path: '/logout',
      Component: () => 'LOGOUT_ROUTE',
      loader: withAuthedUser(loader, {
        sessionID: config.sessionID,
        user: { id: config.userID },
      }),
    },
    {
      path: Routes.Index,
      Component: () => 'INDEX_ROUTE',
    },
    {
      path: '/custom',
      Component: () => 'CUSTOM_ROUTE',
    },
  ]);

  render(<TestRoutesStub initialEntries={['/logout']} />);
}

afterEach(() => {
  drop(db);

  setCookieHeader = null;
});

test('it redirects to index route by default', async () => {
  await setupTest();

  const indexRoute = await screen.findByText('INDEX_ROUTE');

  expect(indexRoute).toBeInTheDocument();
});

test('it redirects to the specified route', async () => {
  await setupTest({
    redirectTo: '/custom',
  });

  const customRoute = await screen.findByText('CUSTOM_ROUTE');

  expect(customRoute).toBeInTheDocument();
});

test('it clears the auth session', async () => {
  await setupTest();

  await screen.findByText('INDEX_ROUTE');

  invariant(setCookieHeader, 'cookie header must be set');

  const authSession = await authSessionStorage.getSession(setCookieHeader);

  expect(authSession.get(SESSION_KEY_AUTH_SESSION_ID)).toBeUndefined();
  expect(authSession.get(SESSION_KEY_AUTH_ACCESS_TOKEN)).toBeUndefined();
});

test('it deletes the session from the database', async () => {
  await setupTest({
    sessionID: 'test_session_id',
    userID: 'test_user_id',
  });

  await screen.findByText('INDEX_ROUTE');

  const deletedSession = db.session.findFirst({
    where: {
      id: {
        equals: 'test_session_id',
      },
    },
  });

  expect(deletedSession).toBeNull();
});

test('it continues logout flow even if session deletion fails', async () => {
  await setupTest({
    sessionID: 'invalid_session_id',
  });

  const indexRoute = await screen.findByText('INDEX_ROUTE');

  expect(indexRoute).toBeInTheDocument();

  invariant(setCookieHeader, 'cookie header must be set');

  const authSession = await authSessionStorage.getSession(setCookieHeader);

  expect(authSession.get(SESSION_KEY_AUTH_SESSION_ID)).toBeUndefined();
  expect(authSession.get(SESSION_KEY_AUTH_ACCESS_TOKEN)).toBeUndefined();
});
