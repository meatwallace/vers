import { expect, test } from 'vitest';
import { createId } from '@paralleldrive/cuid2';
import { sessions } from '@vers/postgres-schema';
import { createTestUser, PostgresTestUtils } from '@vers/service-test-utils';
import { pgTestConfig } from '../pg-test-config';
import { router } from '../router';
import { t } from '../t';

const createCaller = t.createCallerFactory(router);

async function setupTest() {
  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const user = await createTestUser({ db });

  const caller = createCaller({ db });

  return { caller, db, teardown, user };
}

test('it returns all sessions for the user', async () => {
  const { caller, db, teardown, user } = await setupTest();

  const now = new Date();
  const sessionID1 = createId();
  const sessionID2 = createId();

  await db.insert(sessions).values([
    {
      createdAt: now,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      id: sessionID1,
      ipAddress: '127.0.0.1',
      refreshToken: 'refresh-token-1',
      updatedAt: now,
      userID: user.id,
    },
    {
      createdAt: now,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      id: sessionID2,
      ipAddress: '127.0.0.2',
      refreshToken: 'refresh-token-2',
      updatedAt: now,
      userID: user.id,
    },
  ]);

  const result = await caller.getSessions({
    userID: user.id,
  });

  expect(result).toHaveLength(2);
  expect(result).toStrictEqual([
    {
      createdAt: expect.any(Date),
      expiresAt: expect.any(Date),
      id: sessionID1,
      ipAddress: '127.0.0.1',
      refreshToken: 'refresh-token-1',
      updatedAt: expect.any(Date),
      userID: user.id,
    },
    {
      createdAt: expect.any(Date),
      expiresAt: expect.any(Date),
      id: sessionID2,
      ipAddress: '127.0.0.2',
      refreshToken: 'refresh-token-2',
      updatedAt: expect.any(Date),
      userID: user.id,
    },
  ]);

  await teardown();
});

test('it returns an empty array if the user has no sessions', async () => {
  const { caller, teardown, user } = await setupTest();

  const result = await caller.getSessions({
    userID: user.id,
  });

  expect(result).toHaveLength(0);
  expect(result).toStrictEqual([]);

  await teardown();
});
