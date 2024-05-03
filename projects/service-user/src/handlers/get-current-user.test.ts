import { Hono } from 'hono';
import createJWKSMock from 'mock-jwks';
import * as schema from '@chrononomicon/postgres-schema';
import { createAuthMiddleware } from '@chrononomicon/service-utils';
import {
  PostgresTestUtils,
  createTestAccessToken,
} from '@chrononomicon/service-test-utils';
import { env } from '../env';
import { getCurrentUser } from './get-current-user';
import { pgTestConfig } from '../pg-test-config';

const jwks = createJWKSMock(`https://${env.AUTH0_DOMAIN}/`);

const authMiddleware = createAuthMiddleware({
  tokenVerifierConfig: {
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.AUTH0_DOMAIN}/`,
  },
});

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const { accessToken } = createTestAccessToken({
    jwks,
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.AUTH0_DOMAIN}/`,
  });

  jwks.start();

  app.get('/get-current-user', authMiddleware, async (ctx) =>
    getCurrentUser(ctx, db),
  );

  return { app, db, accessToken, teardown };
}

afterEach(() => {
  jwks.stop();
  vi.restoreAllMocks();
});

test('it returns the current user', async () => {
  const { app, db, accessToken, teardown } = await setupTest();

  const createdAt = new Date();

  await db.insert(schema.users).values({
    id: 'test_id',
    auth0ID: 'auth0|test_id',
    email: 'user@test.com',
    emailVerified: true,
    name: 'Test User',
    firstName: 'Test',
    createdAt,
  });

  const req = new Request('http://localhost/get-current-user', {
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
      email: 'user@test.com',
      emailVerified: true,
      name: 'Test User',
      firstName: 'Test',
      createdAt: createdAt.toISOString(),
    },
  });

  await teardown();
});
