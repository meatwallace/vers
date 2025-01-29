import { Hono } from 'hono';
import { test, expect, vi } from 'vitest';
import { PostgresTestUtils, createTestUser } from '@chrono/service-test-utils';
import { createSession } from './create-session';
import { pgTestConfig } from '../pg-test-config';
import { createJWT } from '../utils/create-jwt';

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
  const { app, user, teardown } = await setupTest();

  vi.mocked(createJWT)
    .mockResolvedValueOnce('mock-refresh-token')
    .mockResolvedValueOnce('mock-access-token');

  const req = new Request('http://localhost/create-session', {
    method: 'POST',
    body: JSON.stringify({
      userID: user.id,
      ipAddress: '127.0.0.1',
      rememberMe: false,
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: {
      id: expect.any(String),
      userID: user.id,
      ipAddress: '127.0.0.1',
      refreshToken: 'mock-refresh-token',
      accessToken: 'mock-access-token',
      expiresAt: expect.any(String),
      createdAt: expect.any(String),
    },
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
  const { app, user, teardown } = await setupTest();

  vi.mocked(createJWT)
    .mockResolvedValueOnce('mock-refresh-token')
    .mockResolvedValueOnce('mock-access-token');

  const req = new Request('http://localhost/create-session', {
    method: 'POST',
    body: JSON.stringify({
      userID: user.id,
      ipAddress: '127.0.0.1',
      rememberMe: true,
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: {
      id: expect.any(String),
      userID: user.id,
      ipAddress: '127.0.0.1',
      refreshToken: 'mock-refresh-token',
      accessToken: 'mock-access-token',
      expiresAt: expect.any(String),
      createdAt: expect.any(String),
    },
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
