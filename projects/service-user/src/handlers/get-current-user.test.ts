import { Hono } from 'hono';
import createJWKSMock from 'mock-jwks';
import * as schema from '@campaign/postgres-schema';
import { createAuthMiddleware } from '@campaign/service-utils';
import { PostgresTestUtils } from '@campaign/service-test-utils';
import { env } from '../env';
import { getCurrentUser } from './get-current-user';

// setup jwks mock
const jwks = createJWKSMock(`https://${env.AUTH0_DOMAIN}/`);

const TEST_TOKEN_PAYLOAD = {
  sub: 'auth0|test_id',
  iss: `https://${env.AUTH0_DOMAIN}/`,
  name: 'Test User',
  email: 'user@test.com',
  email_verified: 'true',
};

const authMiddleware = createAuthMiddleware({
  tokenVerifierConfig: {
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.AUTH0_DOMAIN}/`,
  },
});

async function setupTest() {
  const { db, teardown } = await PostgresTestUtils.createTestDB();
  const app = new Hono();

  jwks.start();

  app.get('/get-current-user', authMiddleware, async (ctx) =>
    getCurrentUser(ctx, db),
  );

  const token = jwks.token(TEST_TOKEN_PAYLOAD);

  return { app, db, token, teardown };
}

afterEach(() => {
  jwks.stop();
  vi.restoreAllMocks();
});

test('it returns the current user', async () => {
  const { app, db, token, teardown } = await setupTest();

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
      authorization: `Bearer ${token}`,
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
