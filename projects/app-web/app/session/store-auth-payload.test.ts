import { expect, test } from 'vitest';
import { createCookieSessionStorage } from 'react-router';
import { storeAuthPayload } from './store-auth-payload';
import {
  SESSION_KEY_AUTH_SESSION_ID,
  SESSION_KEY_AUTH_ACCESS_TOKEN,
  SESSION_KEY_AUTH_REFRESH_TOKEN,
} from './consts';

async function setupTest() {
  const sessionStorage = createCookieSessionStorage({
    cookie: {
      name: 'test_session',
      secrets: ['test_secret'],
    },
  });

  return {
    sessionStorage,
  };
}

test('it stores the session ID in the session', async () => {
  const { sessionStorage } = await setupTest();

  const session = await sessionStorage.getSession();

  const authPayload = {
    accessToken: 'test_access_token',
    refreshToken: 'test_refresh_token',
    session: {
      id: 'test_session_id',
      expiresAt: '2024-02-13T12:00:00Z',
    },
  };

  storeAuthPayload(session, authPayload);

  const sessionID = session.get(SESSION_KEY_AUTH_SESSION_ID);

  expect(sessionID).toBe(authPayload.session.id);
});

test('it stores the access token in the session', async () => {
  const { sessionStorage } = await setupTest();

  const session = await sessionStorage.getSession();

  const authPayload = {
    accessToken: 'test_access_token',
    refreshToken: 'test_refresh_token',
    session: {
      id: 'test_session_id',
      expiresAt: '2024-02-13T12:00:00Z',
    },
  };

  storeAuthPayload(session, authPayload);

  const accessToken = session.get(SESSION_KEY_AUTH_ACCESS_TOKEN);

  expect(accessToken).toBe(authPayload.accessToken);
});

test('it stores the refresh token in the session', async () => {
  const { sessionStorage } = await setupTest();

  const session = await sessionStorage.getSession();

  const authPayload = {
    accessToken: 'test_access_token',
    refreshToken: 'test_refresh_token',
    session: {
      id: 'test_session_id',
      expiresAt: '2024-02-13T12:00:00Z',
    },
  };

  storeAuthPayload(session, authPayload);

  const refreshToken = session.get(SESSION_KEY_AUTH_REFRESH_TOKEN);

  expect(refreshToken).toBe(authPayload.refreshToken);
});
