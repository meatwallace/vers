import { expect, test, vi } from 'vitest';
import { createTestUser, PostgresTestUtils } from '@vers/service-test-utils';
import { Hono } from 'hono';
import { pgTestConfig } from '../pg-test-config';
import { createJWT } from '../utils/create-jwt';
import { createSession } from './create-session';

vi.mock('../utils/create-jwt');

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const user = await createTestUser({ db });

  app.post('/create-session', async (ctx) => createSession(ctx, db));

  return { app, db, teardown, user };
}

afterEach(() => {
  vi.clearAllMocks();
});

test('it creates a session with default refresh token duration', async () => {
  const { app, teardown, user } = await setupTest();

  vi.mocked(createJWT)
    .mockResolvedValueOnce('mock-refresh-token')
    .mockResolvedValueOnce('mock-access-token');

  const req = new Request('http://localhost/create-session', {
    body: JSON.stringify({
      ipAddress: '127.0.0.1',
      rememberMe: false,
      userID: user.id,
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: {
      accessToken: 'mock-access-token',
      createdAt: expect.any(String),
      expiresAt: expect.any(String),
      id: expect.any(String),
      ipAddress: '127.0.0.1',
      refreshToken: 'mock-refresh-token',
      userID: user.id,
    },
    success: true,
  });

  const refreshTokenCall = vi.mocked(createJWT).mock.calls[0][0];
  const accessTokenCall = vi.mocked(createJWT).mock.calls[1][0];

  const now = Date.now();
  const refreshTokenExpires = refreshTokenCall.expiresAt.getTime();
  const accessTokenExpires = accessTokenCall.expiresAt.getTime();

  expect(refreshTokenExpires - now).toBeCloseTo(24 * 60 * 60 * 1000, -2);
  expect(accessTokenExpires - now).toBeCloseTo(15 * 60 * 1000, -2);

  await teardown();
});

test('it creates a session with extended refresh token duration', async () => {
  const { app, teardown, user } = await setupTest();

  vi.mocked(createJWT)
    .mockResolvedValueOnce('mock-refresh-token')
    .mockResolvedValueOnce('mock-access-token');

  const req = new Request('http://localhost/create-session', {
    body: JSON.stringify({
      ipAddress: '127.0.0.1',
      rememberMe: true,
      userID: user.id,
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: {
      accessToken: 'mock-access-token',
      createdAt: expect.any(String),
      expiresAt: expect.any(String),
      id: expect.any(String),
      ipAddress: '127.0.0.1',
      refreshToken: 'mock-refresh-token',
      userID: user.id,
    },
    success: true,
  });

  const refreshTokenCall = vi.mocked(createJWT).mock.calls[0][0];

  const now = Date.now();
  const refreshTokenExpires = refreshTokenCall.expiresAt.getTime();

  expect(refreshTokenExpires - now).toBeCloseTo(7 * 24 * 60 * 60 * 1000, -2);

  await teardown();
});

test('handles an invalid request body', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/create-session', {
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
