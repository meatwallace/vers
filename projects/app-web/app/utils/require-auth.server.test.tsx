import { afterEach, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRoutesStub, type LoaderFunction } from 'react-router';
import { drop } from '@mswjs/data';
import invariant from 'tiny-invariant';
import { db } from '~/mocks/db.ts';
import { decodeMockJWT } from '~/mocks/utils/decode-mock-jwt.ts';
import { encodeMockJWT } from '~/mocks/utils/encode-mock-jwt.ts';
import { authSessionStorage } from '~/session/auth-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { createGQLClient } from './create-gql-client.server.ts';
import { requireAuth } from './require-auth.server.ts';

interface TestConfig {
  accessToken?: string;
  initialPath?: string;
  refreshToken?: string;
  sessionID?: string;
}

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
  const client = createGQLClient();

  const session = await authSessionStorage.getSession();

  if (config.sessionID) {
    session.set('sessionID', config.sessionID);
  }

  if (config.accessToken) {
    session.set('accessToken', config.accessToken);
  }

  if (config.refreshToken) {
    session.set('refreshToken', config.refreshToken);
  }

  const initialCookieHeader = await authSessionStorage.commitSession(session);

  let isFirstCall = true;

  // wrap our utility with a loader that sets the session as needed
  const loader: LoaderFunction = async ({ request }) => {
    // if it's our first call to our loader, set the cookie header to our initial
    // value so any initial auth we've configured works
    if (isFirstCall) {
      request.headers.set('cookie', initialCookieHeader);
      // if it isn't our first call, we might've set a cookie, so manually set it
    } else if (setCookieHeader) {
      request.headers.set('cookie', setCookieHeader);
    }

    isFirstCall = false;

    await requireAuth(request, { client });
  };

  const TestRoutesStub = createRoutesStub([
    {
      Component: () => 'TEST_ROUTE',
      loader,
      path: '/',
    },
    {
      Component: () => 'LOGIN_ROUTE',
      path: Routes.Login,
    },
    {
      Component: () => 'LOGOUT_ROUTE',
      path: Routes.Logout,
    },
  ]);

  render(<TestRoutesStub />);
}

afterEach(() => {
  drop(db);

  setCookieHeader = null;
});

test('it allows access with valid session', async () => {
  const user = db.user.create({
    id: 'test_user_id',
  });

  const accessToken = encodeMockJWT({
    exp: Math.floor(Date.now() / 1000) + 1000, // Not expired
    sub: user.id,
  });

  await setupTest({
    accessToken,
    refreshToken: 'valid_refresh_token',
    sessionID: 'test_session_id',
  });

  const testRoute = await screen.findByText('TEST_ROUTE');

  expect(testRoute).toBeInTheDocument();
});

test('it redirects to login when no session exists', async () => {
  await setupTest();

  const loginRoute = await screen.findByText('LOGIN_ROUTE');

  expect(loginRoute).toBeInTheDocument();
});

test('it redirects to login when session is incomplete', async () => {
  await setupTest({
    sessionID: 'test_session_id',
  });

  const loginRoute = await screen.findByText('LOGIN_ROUTE');

  expect(loginRoute).toBeInTheDocument();
});

test('it logs the user out if the access and refresh token are expired', async () => {
  const user = db.user.create({});

  const refreshToken = encodeMockJWT({
    exp: Math.floor(Date.now() / 1000) - 1000, // Expired
    sub: user.id,
  });

  const session = db.session.create({
    refreshToken,
    userID: user.id,
  });

  const expiredToken = encodeMockJWT({
    exp: Math.floor(Date.now() / 1000) - 1000, // Expired
    sub: user.id,
  });

  await setupTest({
    accessToken: expiredToken,
    refreshToken: session.refreshToken,
    sessionID: session.id,
  });

  const loginRoute = await screen.findByText('LOGIN_ROUTE');

  expect(loginRoute).toBeInTheDocument();

  const deletedSession = db.session.findFirst({
    where: {
      id: {
        equals: session.id,
      },
    },
  });

  expect(deletedSession).toBeNull();
});

test('it logs the user out when refreshing the access token fails', async () => {
  // creating a session with a bogus user ID causes token refresh to fail
  const session = db.session.create({
    userID: 'test_user_id',
  });

  const accessToken = encodeMockJWT({
    exp: Math.floor(Date.now() / 1000) - 1000, // Expired
    sub: session.userID,
  });

  await setupTest({
    accessToken,
    refreshToken: session.refreshToken,
    sessionID: session.id,
  });

  const loginRoute = await screen.findByText('LOGIN_ROUTE');

  expect(loginRoute).toBeInTheDocument();

  const deletedSession = db.session.findFirst({
    where: {
      id: {
        equals: session.id,
      },
    },
  });

  expect(deletedSession).toBeNull();
});

test('it refreshes the session when access token is expired', async () => {
  const user = db.user.create({
    id: 'test_user_id',
  });

  const expiredAccessToken = encodeMockJWT({
    exp: Math.floor(Date.now() / 1000) - 1000, // Expired
    sub: user.id,
  });

  const session = db.session.create({
    id: 'test_session_id',
    userID: user.id,
  });

  await setupTest({
    accessToken: expiredAccessToken,
    refreshToken: session.refreshToken,
    sessionID: session.id,
  });

  // ensure we end up at the expected route after refreshing the access token
  const testRoute = await screen.findByText('TEST_ROUTE');

  expect(testRoute).toBeInTheDocument();

  const authSession = await authSessionStorage.getSession(setCookieHeader);
  const accessToken = authSession.get('accessToken');

  invariant(accessToken, 'access token must be set');

  const payload = decodeMockJWT(accessToken);

  // ensure our access token has been refreshed
  expect(accessToken).not.toBe(expiredAccessToken);
  expect(payload.sub).toBe(user.id);
  expect(payload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
});
