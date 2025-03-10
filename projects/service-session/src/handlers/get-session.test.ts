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

test('it returns the requested session', async () => {
  const { caller, db, teardown, user } = await setupTest();

  const sessionID = createId();
  const now = new Date();

  await db.insert(sessions).values({
    createdAt: now,
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours from now
    id: sessionID,
    ipAddress: '127.0.0.1',
    refreshToken: createId(),
    updatedAt: now,
    userID: user.id,
  });

  const result = await caller.getSession({
    id: sessionID,
  });

  expect(result).toStrictEqual({
    createdAt: expect.any(Date),
    expiresAt: expect.any(Date),
    id: sessionID,
    ipAddress: '127.0.0.1',
    updatedAt: expect.any(Date),
    userID: user.id,
  });

  await teardown();
});

test('it returns null for non-existent session', async () => {
  const { caller, teardown } = await setupTest();

  const result = await caller.getSession({
    id: 'non-existent-id',
  });

  expect(result).toBeNull();

  await teardown();
});
