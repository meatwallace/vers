import { afterEach, expect, test, vi } from 'vitest';
import * as schema from '@vers/postgres-schema';
import { createTestDB, createTestUser } from '@vers/service-test-utils';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { router } from '../router';
import { t } from '../t';
import { createJWT } from '../utils/create-jwt';

vi.mock('../utils/create-jwt');

const createCaller = t.createCallerFactory(router);

interface TestConfig {
  db: PostgresJsDatabase<typeof schema>;
}

async function setupTest(config: TestConfig) {
  const caller = createCaller({ db: config.db });

  const user = await createTestUser({ db: config.db });

  return { caller, user };
}

afterEach(() => {
  vi.clearAllMocks();
});

test('it creates a session with default refresh token duration', async () => {
  await using handle = await createTestDB();

  const { db } = handle;

  const { caller, user } = await setupTest({ db });

  vi.mocked(createJWT)
    .mockResolvedValueOnce('mock-refresh-token')
    .mockResolvedValueOnce('mock-access-token');

  const result = await caller.createSession({
    ipAddress: '127.0.0.1',
    rememberMe: false,
    userID: user.id,
  });

  expect(result).toStrictEqual({
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    session: {
      createdAt: expect.any(Date),
      expiresAt: expect.any(Date),
      id: expect.any(String),
      ipAddress: '127.0.0.1',
      updatedAt: expect.any(Date),
      userID: user.id,
    },
  });

  const refreshTokenCall = vi.mocked(createJWT).mock.calls[0][0];
  const accessTokenCall = vi.mocked(createJWT).mock.calls[1][0];

  const now = Date.now();
  const refreshTokenExpires = refreshTokenCall.expiresAt.getTime();
  const accessTokenExpires = accessTokenCall.expiresAt.getTime();

  expect(refreshTokenExpires - now).toBeCloseTo(24 * 60 * 60 * 1000, -2);
  expect(accessTokenExpires - now).toBeCloseTo(15 * 60 * 1000, -2);
});

test('it creates a session with extended refresh token duration', async () => {
  await using handle = await createTestDB();

  const { db } = handle;

  const { caller, user } = await setupTest({ db });

  vi.mocked(createJWT)
    .mockResolvedValueOnce('mock-refresh-token')
    .mockResolvedValueOnce('mock-access-token');

  const result = await caller.createSession({
    ipAddress: '127.0.0.1',
    rememberMe: true,
    userID: user.id,
  });

  expect(result).toStrictEqual({
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    session: {
      createdAt: expect.any(Date),
      expiresAt: expect.any(Date),
      id: expect.any(String),
      ipAddress: '127.0.0.1',
      updatedAt: expect.any(Date),
      userID: user.id,
    },
  });

  const refreshTokenCall = vi.mocked(createJWT).mock.calls[0][0];

  const now = Date.now();
  const refreshTokenExpires = refreshTokenCall.expiresAt.getTime();

  expect(refreshTokenExpires - now).toBeCloseTo(7 * 24 * 60 * 60 * 1000, -2);
});
