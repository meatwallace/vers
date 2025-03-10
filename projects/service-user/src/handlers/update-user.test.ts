import { expect, test } from 'vitest';
import { users } from '@vers/postgres-schema';
import { createTestUser, PostgresTestUtils } from '@vers/service-test-utils';
import { eq } from 'drizzle-orm';
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

test('it updates the provided user', async () => {
  const { caller, db, teardown, user } = await setupTest();

  const update = {
    name: 'Updated Name',
    username: 'updated_username',
  };

  const result = await caller.updateUser({
    id: user.id,
    ...update,
  });

  const updatedUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });

  expect(result).toEqual({
    updatedID: user.id,
  });

  expect(updatedUser).toMatchObject({
    createdAt: expect.any(Date),
    id: user.id,
    name: 'Updated Name',
    updatedAt: expect.any(Date),
    username: 'updated_username',
  });

  expect(updatedUser?.updatedAt.getTime()).toBeGreaterThan(
    user.updatedAt.getTime(),
  );

  await teardown();
});

test('it allows partial updating', async () => {
  const { caller, db, teardown, user } = await setupTest();

  const update = {
    name: 'Updated Name',
  };

  const result = await caller.updateUser({
    id: user.id,
    ...update,
  });

  const updatedUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });

  expect(result).toEqual({
    updatedID: user.id,
  });

  expect(updatedUser).toMatchObject({
    createdAt: expect.any(Date),
    email: user.email,
    id: user.id,
    name: 'Updated Name',
    updatedAt: expect.any(Date),
    username: user.username,
  });

  await teardown();
});
