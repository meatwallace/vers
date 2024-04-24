import { Hono } from 'hono';
import createJWKSMock from 'mock-jwks';
import * as schema from '@campaign/postgres-schema';
import { env } from '../env';
import { createAuthMiddleware } from '@campaign/service-utils';
import { getOrCreateUser } from './get-or-create-user';
import { PostgresTestUtils } from '../../../lib-service-test-utils/src';

// mock auth0 user info client
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

// setup jwks mock
const jwks = createJWKSMock(`https://${env.AUTH0_DOMAIN}/`);

const TEST_TOKEN_PAYLOAD = {
  sub: 'test_id',
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
  app.get('/test', authMiddleware, async (ctx) => getOrCreateUser(ctx, db));

  const token = jwks.token(TEST_TOKEN_PAYLOAD);

  return { app, db, token, teardown };
}

afterEach(() => {
  jwks.stop();
  vi.restoreAllMocks();
});

test('it creates and returns a user', async () => {
  const { app, token, teardown } = await setupTest();

  getUserInfoMock.mockImplementation(() => ({
    data: {
      email: 'user@test.com',
      email_verified: true,
      name: 'Test User',
    },
  }));

  const req = new Request('http://localhost/test');

  req.headers.set('Authorization', `Bearer ${token}`);

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    success: true,
    data: {
      id: 'test_id',
      name: 'Test User',
      email: 'user@test.com',
      emailVerified: true,
    },
  });

  await teardown();
});

test('it returns an existing user', async () => {
  const { app, db, token, teardown } = await setupTest();

  await db.insert(schema.users).values({
    id: 'test_id',
    name: 'Test User',
    email: 'user@test.com',
    emailVerified: true,
  });

  const req = new Request('http://localhost/test');

  req.headers.set('Authorization', `Bearer ${token}`);

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    success: true,
    data: {
      id: 'test_id',
      name: 'Test User',
      email: 'user@test.com',
      emailVerified: true,
    },
  });

  await teardown();
});
