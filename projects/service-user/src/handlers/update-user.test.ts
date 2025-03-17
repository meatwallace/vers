import { expect, test } from 'vitest';
import * as schema from '@vers/postgres-schema';
import { createTestDB, createTestUser } from '@vers/service-test-utils';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { router } from '../router';
import { t } from '../t';

const createCaller = t.createCallerFactory(router);

interface TestConfig {
  db: PostgresJsDatabase<typeof schema>;
}

function setupTest(config: TestConfig) {
  const caller = createCaller({ db: config.db });

  return { caller };
}

test('it updates the provided user', async () => {
  await using handle = await createTestDB();

  const { db } = handle;

  const user = await createTestUser({ db });

  const { caller } = setupTest({ db });

  const update = {
    email: 'updated@test.com',
    name: 'Updated Name',
    username: 'updated_username',
  };

  const result = await caller.updateUser({
    id: user.id,
    ...update,
  });

  const updatedUser = await db.query.users.findFirst({
    where: eq(schema.users.id, user.id),
  });

  expect(result).toStrictEqual({ updatedID: user.id });

  expect(updatedUser).toStrictEqual({
    ...user,
    email: 'updated@test.com',
    name: 'Updated Name',
    updatedAt: expect.any(Date),
    username: 'updated_username',
  });

  expect(updatedUser?.updatedAt.getTime()).toBeGreaterThan(
    user.updatedAt.getTime(),
  );
});

test('it allows partial updating', async () => {
  await using handle = await createTestDB();

  const { db } = handle;

  const user = await createTestUser({ db });

  const { caller } = setupTest({ db });

  const update = {
    name: 'Updated Name',
  };

  const result = await caller.updateUser({
    id: user.id,
    ...update,
  });

  const updatedUser = await db.query.users.findFirst({
    where: eq(schema.users.id, user.id),
  });

  expect(result).toStrictEqual({ updatedID: user.id });

  expect(updatedUser).toStrictEqual({
    ...user,
    name: 'Updated Name',
    updatedAt: expect.any(Date),
  });
});
