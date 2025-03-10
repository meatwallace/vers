import { expect, test } from 'vitest';
import * as schema from '@vers/postgres-schema';
import { createTestUser, PostgresTestUtils } from '@vers/service-test-utils';
import { pgTestConfig } from '../pg-test-config';
import { router } from '../router';
import { t } from '../t';

const createCaller = t.createCallerFactory(router);

async function setupTest() {
  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const caller = createCaller({ db });

  return { caller, db, teardown };
}

test('it deletes a session', async () => {
  const { caller, db, teardown } = await setupTest();

  const user = await createTestUser({ db });

  const session = {
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    id: 'test_session_id',
    ipAddress: '127.0.0.1',
    refreshToken: 'test_refresh_token',
    updatedAt: new Date(),
    userID: user.id,
  };

  await db.insert(schema.sessions).values(session);

  const result = await caller.deleteSession({
    id: session.id,
    userID: user.id,
  });

  expect(result).toEqual({});

  const deletedSession = await db.query.sessions.findFirst({
    where: (sessions, { eq }) => eq(sessions.id, session.id),
  });

  expect(deletedSession).toBeUndefined();

  await teardown();
});

test('it does not delete a session when userID does not match', async () => {
  const { caller, db, teardown } = await setupTest();

  const user = await createTestUser({ db });

  const session = {
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    id: 'test_session_id',
    ipAddress: '127.0.0.1',
    refreshToken: 'test_refresh_token',
    updatedAt: new Date(),
    userID: user.id,
  };

  await db.insert(schema.sessions).values(session);

  const result = await caller.deleteSession({
    id: session.id,
    userID: 'different_user_id',
  });

  expect(result).toEqual({});

  // verify session was not deleted
  const existingSession = await db.query.sessions.findFirst({
    where: (sessions, { eq }) => eq(sessions.id, session.id),
  });

  expect(existingSession).not.toBeNull();

  await teardown();
});
