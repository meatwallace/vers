import { expect, test, vi } from 'vitest';
import * as schema from '@chrono/postgres-schema';
import { createTestUser, PostgresTestUtils } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import * as consts from '../consts';
import { pgTestConfig } from '../pg-test-config';
import { createJWT } from '../utils/create-jwt';
import { refreshTokens } from './refresh-tokens';

vi.mock('../utils/create-jwt');

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const user = await createTestUser({ db });

  app.post('/refresh-tokens', async (ctx) => refreshTokens(ctx, db));

  return { app, db, teardown, user };
}

afterEach(() => {
  vi.clearAllMocks();
});

test('it refreshes tokens for a young session without rotating the refresh token', async () => {
  const { app, db, teardown, user } = await setupTest();

  const session = {
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + consts.REFRESH_TOKEN_DURATION_LONG),
    id: createId(),
    ipAddress: '127.0.0.1',
    refreshToken: 'existing-refresh-token',
    userID: user.id,
  };

  await db.insert(schema.sessions).values(session);

  vi.mocked(createJWT).mockResolvedValueOnce('new-access-token');

  const req = new Request('http://localhost/refresh-tokens', {
    body: JSON.stringify({
      refreshToken: session.refreshToken,
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: {
      accessToken: 'new-access-token',
      createdAt: expect.any(String),
      expiresAt: expect.any(String),
      id: session.id,
      ipAddress: session.ipAddress,
      refreshToken: session.refreshToken,
      userID: session.userID,
    },
    success: true,
  });

  expect(createJWT).toHaveBeenCalledTimes(1);

  await teardown();
});

test('it rotates the refresh token if the provided one is older than our short refresh duration', async () => {
  const { app, db, teardown, user } = await setupTest();

  const session = {
    createdAt: new Date(Date.now() - consts.REFRESH_TOKEN_DURATION - 1000),
    expiresAt: new Date(Date.now() + consts.REFRESH_TOKEN_DURATION_LONG),
    id: createId(),
    ipAddress: '127.0.0.1',
    refreshToken: 'existing-refresh-token',
    userID: user.id,
  };

  await db.insert(schema.sessions).values(session);

  vi.mocked(createJWT)
    .mockResolvedValueOnce('new-refresh-token')
    .mockResolvedValueOnce('new-access-token');

  const req = new Request('http://localhost/refresh-tokens', {
    body: JSON.stringify({
      refreshToken: session.refreshToken,
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: {
      accessToken: 'new-access-token',
      createdAt: expect.any(String),
      expiresAt: expect.any(String),
      id: session.id,
      ipAddress: session.ipAddress,
      refreshToken: 'new-refresh-token',
      userID: session.userID,
    },
    success: true,
  });

  expect(createJWT).toHaveBeenCalledTimes(2);

  await teardown();
});

test('it handles an expired session', async () => {
  const { app, db, teardown, user } = await setupTest();

  const session = {
    createdAt: new Date(),
    expiresAt: new Date(Date.now() - 1000),
    id: createId(),
    ipAddress: '127.0.0.1',
    refreshToken: 'existing-refresh-token',
    userID: user.id,
  };

  await db.insert(schema.sessions).values(session);

  const req = new Request('http://localhost/refresh-tokens', {
    body: JSON.stringify({
      refreshToken: session.refreshToken,
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    error: 'Session expired',
    success: false,
  });

  // verify the session was deleted
  const [deletedSession] = await db
    .select()
    .from(schema.sessions)
    .where(eq(schema.sessions.id, session.id));

  expect(deletedSession).toBeUndefined();

  await teardown();
});

test('it handles an invalid refresh token', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/refresh-tokens', {
    body: JSON.stringify({
      refreshToken: 'invalid-token',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    error: 'Invalid refresh token',
    success: false,
  });

  await teardown();
});

test('it handles an invalid request body', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/refresh-tokens', {
    body: 'invalid json',
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    error: 'An unknown error occurred',
    success: false,
  });

  await teardown();
});
