import { Hono } from 'hono';
import { test, expect, vi } from 'vitest';
import { eq } from 'drizzle-orm';
import { PostgresTestUtils, createTestUser } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import * as schema from '@chrono/postgres-schema';
import { refreshTokens } from './refresh-tokens';
import { pgTestConfig } from '../pg-test-config';
import { createJWT } from '../utils/create-jwt';
import * as consts from '../consts';

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
    id: createId(),
    refreshToken: 'existing-refresh-token',
    expiresAt: new Date(Date.now() + consts.REFRESH_TOKEN_DURATION_LONG),
    ipAddress: '127.0.0.1',
    userID: user.id,
    createdAt: new Date(),
  };

  await db.insert(schema.sessions).values(session);

  vi.mocked(createJWT).mockResolvedValueOnce('new-access-token');

  const req = new Request('http://localhost/refresh-tokens', {
    method: 'POST',
    body: JSON.stringify({
      refreshToken: session.refreshToken,
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: {
      id: session.id,
      userID: session.userID,
      ipAddress: session.ipAddress,
      refreshToken: session.refreshToken,
      accessToken: 'new-access-token',
      expiresAt: expect.any(String),
      createdAt: expect.any(String),
    },
  });

  expect(createJWT).toHaveBeenCalledTimes(1);

  await teardown();
});

test('it rotates the refresh token if the provided one is older than our short refresh duration', async () => {
  const { app, db, teardown, user } = await setupTest();

  const session = {
    id: createId(),
    refreshToken: 'existing-refresh-token',
    expiresAt: new Date(Date.now() + consts.REFRESH_TOKEN_DURATION_LONG),
    ipAddress: '127.0.0.1',
    userID: user.id,
    createdAt: new Date(Date.now() - consts.REFRESH_TOKEN_DURATION - 1000),
  };

  await db.insert(schema.sessions).values(session);

  vi.mocked(createJWT)
    .mockResolvedValueOnce('new-refresh-token')
    .mockResolvedValueOnce('new-access-token');

  const req = new Request('http://localhost/refresh-tokens', {
    method: 'POST',
    body: JSON.stringify({
      refreshToken: session.refreshToken,
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: {
      id: session.id,
      userID: session.userID,
      ipAddress: session.ipAddress,
      refreshToken: 'new-refresh-token',
      accessToken: 'new-access-token',
      expiresAt: expect.any(String),
      createdAt: expect.any(String),
    },
  });

  expect(createJWT).toHaveBeenCalledTimes(2);

  await teardown();
});

test('it handles an expired session', async () => {
  const { app, db, teardown, user } = await setupTest();

  const session = {
    id: createId(),
    refreshToken: 'existing-refresh-token',
    expiresAt: new Date(Date.now() - 1000),
    ipAddress: '127.0.0.1',
    userID: user.id,
    createdAt: new Date(),
  };

  await db.insert(schema.sessions).values(session);

  const req = new Request('http://localhost/refresh-tokens', {
    method: 'POST',
    body: JSON.stringify({
      refreshToken: session.refreshToken,
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: false,
    error: 'Session expired',
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
    method: 'POST',
    body: JSON.stringify({
      refreshToken: 'invalid-token',
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: false,
    error: 'Invalid refresh token',
  });

  await teardown();
});

test('it handles an invalid request body', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/refresh-tokens', {
    method: 'POST',
    body: 'invalid json',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: false,
    error: 'An unknown error occurred',
  });

  await teardown();
});
