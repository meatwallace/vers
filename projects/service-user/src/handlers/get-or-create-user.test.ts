import { Hono } from 'hono';
import createJWKSMock from 'mock-jwks';
import * as schema from '@chrononomicon/postgres-schema';
import { createAuthMiddleware } from '@chrononomicon/service-utils';
import {
  PostgresTestUtils,
  createTestAccessToken,
} from '@chrononomicon/service-test-utils';
import { env } from '../env';
import { getOrCreateUser } from './get-or-create-user';
import { pgTestConfig } from '../pg-test-config';

const { getUserInfoMock } = vi.hoisted(() => ({ getUserInfoMock: vi.fn() }));

vi.mock('auth0', async (importOriginal) => {
  const original = await importOriginal<typeof import('auth0')>();

  class UserInfoClientMock {
    getUserInfo = getUserInfoMock;
  }

  return {
    ...original,
    UserInfoClient: UserInfoClientMock,
  };
});

const ISSUER = `https://${env.AUTH0_DOMAIN}/`;

const jwks = createJWKSMock(ISSUER);

const authMiddleware = createAuthMiddleware({
  tokenVerifierConfig: {
    audience: env.API_IDENTIFIER,
    issuer: ISSUER,
  },
});

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  jwks.start();

  app.post('/get-or-create-user', authMiddleware, async (ctx) =>
    getOrCreateUser(ctx, db),
  );

  const { accessToken } = createTestAccessToken({
    jwks,
    audience: env.API_IDENTIFIER,
    issuer: ISSUER,
  });

  return { app, db, accessToken, teardown };
}

afterEach(() => {
  jwks.stop();
  vi.restoreAllMocks();
});

test('it creates and returns a user', async () => {
  const { app, accessToken, teardown } = await setupTest();

  getUserInfoMock.mockImplementation(() => ({
    data: {
      sub: 'auth0|test_id',
      email: 'user@test.com',
      email_verified: true,
      name: 'Test User',
      given_name: 'Test',
    },
  }));

  const req = new Request('http://localhost/get-or-create-user', {
    method: 'POST',
    body: JSON.stringify({ email: 'user@test.com' }),
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    success: true,
    data: {
      id: expect.any(String),
      auth0ID: 'auth0|test_id',
      name: 'Test User',
      firstName: 'Test',
      email: 'user@test.com',
      emailVerified: true,
      createdAt: expect.any(String),
    },
  });

  await teardown();
});

test('it returns an existing user', async () => {
  const { app, db, accessToken, teardown } = await setupTest();

  await db.insert(schema.users).values({
    id: 'test_id',
    auth0ID: 'auth0|test_id',
    name: 'Test User',
    firstName: 'Test',
    email: 'user@test.com',
    emailVerified: true,
  });

  const req = new Request('http://localhost/get-or-create-user', {
    method: 'POST',
    body: JSON.stringify({ email: 'user@test.com' }),
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    success: true,
    data: {
      id: 'test_id',
      auth0ID: 'auth0|test_id',
      name: 'Test User',
      firstName: 'Test',
      email: 'user@test.com',
      emailVerified: true,
      createdAt: expect.any(String),
    },
  });

  await teardown();
});
