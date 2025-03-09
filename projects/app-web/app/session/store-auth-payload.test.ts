import { expect, test } from 'vitest';
import { createCookieSessionStorage } from 'react-router';
import { storeAuthPayload } from './store-auth-payload';

function setupTest() {
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
  const { sessionStorage } = setupTest();

  const session = await sessionStorage.getSession();

  const authPayload = {
    accessToken: 'test_access_token',
    refreshToken: 'test_refresh_token',
    session: {
      expiresAt: '2024-02-13T12:00:00Z',
      id: 'test_session_id',
    },
  };

  storeAuthPayload(session, authPayload);

  const sessionID = session.get('sessionID');

  expect(sessionID).toBe(authPayload.session.id);
});

test('it stores the access token in the session', async () => {
  const { sessionStorage } = setupTest();

  const session = await sessionStorage.getSession();

  const authPayload = {
    accessToken: 'test_access_token',
    refreshToken: 'test_refresh_token',
    session: {
      expiresAt: '2024-02-13T12:00:00Z',
      id: 'test_session_id',
    },
  };

  storeAuthPayload(session, authPayload);

  const accessToken = session.get('accessToken');

  expect(accessToken).toBe(authPayload.accessToken);
});

test('it stores the refresh token in the session', async () => {
  const { sessionStorage } = setupTest();

  const session = await sessionStorage.getSession();

  const authPayload = {
    accessToken: 'test_access_token',
    refreshToken: 'test_refresh_token',
    session: {
      expiresAt: '2024-02-13T12:00:00Z',
      id: 'test_session_id',
    },
  };

  storeAuthPayload(session, authPayload);

  const refreshToken = session.get('refreshToken');

  expect(refreshToken).toBe(authPayload.refreshToken);
});
