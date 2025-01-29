import invariant from 'tiny-invariant';
import { afterEach, expect, test } from 'vitest';
import { createRoutesStub, type LoaderFunction } from 'react-router';
import { render, screen } from '@testing-library/react';
import { GraphQLClient } from 'graphql-request';
import { drop } from '@mswjs/data';
import { db } from '~/mocks/db.ts';
import { decodeMockJWT } from '~/mocks/utils/decode-mock-jwt.ts';
import { encodeMockJWT } from '~/mocks/utils/encode-mock-jwt.ts';
import { authSessionStorage } from '~/session/auth-session-storage.server.ts';
import {
  SESSION_KEY_AUTH_ACCESS_TOKEN,
  SESSION_KEY_AUTH_REFRESH_TOKEN,
  SESSION_KEY_AUTH_SESSION_ID,
} from '~/session/consts.ts';
import { Routes } from '~/types.ts';
import { requireAuth } from './require-auth.server.ts';

type TestConfig = {
  initialPath?: string;
  sessionID?: string;
  accessToken?: string;
  refreshToken?: string;
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

  const session = await authSessionStorage.getSession();

  if (config.sessionID) {
    session.set(SESSION_KEY_AUTH_SESSION_ID, config.sessionID);
  }

  if (config.accessToken) {
    session.set(SESSION_KEY_AUTH_ACCESS_TOKEN, config.accessToken);
  }

  if (config.refreshToken) {
    session.set(SESSION_KEY_AUTH_REFRESH_TOKEN, config.refreshToken);
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
    } else if (!isFirstCall && setCookieHeader) {
      request.headers.set('cookie', setCookieHeader);
    }

    isFirstCall = false;

    await requireAuth(request, { client });
  };

  const TestRoutesSTub = createRoutesStub([
    {
      path: '/',
      Component: () => 'TEST_ROUTE',
      loader,
    },
    {
      path: Routes.Login,
      Component: () => 'LOGIN_ROUTE',
    },
    {
      path: Routes.Logout,
      Component: () => 'LOGOUT_ROUTE',
    },
  ]);

  render(<TestRoutesSTub />);
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
    sub: user.id,
    exp: Math.floor(Date.now() / 1000) + 1000, // Not expired
  });

  await setupTest({
    sessionID: 'test_session_id',
    accessToken,
    refreshToken: 'valid_refresh_token',
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
    sub: user.id,
    exp: Math.floor(Date.now() / 1000) - 1000, // Expired
  });

  const session = db.session.create({
    userID: user.id,
    refreshToken,
  });

  const expiredToken = encodeMockJWT({
    sub: user.id,
    exp: Math.floor(Date.now() / 1000) - 1000, // Expired
  });

  await setupTest({
    sessionID: session.id,
    accessToken: expiredToken,
    refreshToken: session.refreshToken,
  });

  const loginRoute = await screen.findByText('LOGIN_ROUTE');

  expect(loginRoute).toBeInTheDocument();

  const deletedSession = await db.session.findFirst({
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
    sub: session.userID,
    exp: Math.floor(Date.now() / 1000) - 1000, // Expired
  });

  await setupTest({
    sessionID: session.id,
    accessToken,
    refreshToken: session.refreshToken,
  });

  const loginRoute = await screen.findByText('LOGIN_ROUTE');

  expect(loginRoute).toBeInTheDocument();

  const deletedSession = await db.session.findFirst({
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
    sub: user.id,
    exp: Math.floor(Date.now() / 1000) - 1000, // Expired
  });

  const session = db.session.create({
    id: 'test_session_id',
    userID: user.id,
  });

  await setupTest({
    sessionID: session.id,
    accessToken: expiredAccessToken,
    refreshToken: session.refreshToken,
  });

  // ensure we end up at the expected route after refreshing the access token
  const testRoute = await screen.findByText('TEST_ROUTE');

  expect(testRoute).toBeInTheDocument();

  const authSession = await authSessionStorage.getSession(setCookieHeader);
  const accessToken = authSession.get(SESSION_KEY_AUTH_ACCESS_TOKEN);

  invariant(accessToken, 'access token must be set');

  const payload = decodeMockJWT(accessToken);

  // ensure our access token has been refreshed
  expect(accessToken).not.toBe(expiredAccessToken);
  expect(payload.sub).toBe(user.id);
  expect(payload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
});
