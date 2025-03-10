import { expect, test } from 'vitest';
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

test('it gets a user by ID', async () => {
  const { caller, teardown, user } = await setupTest();

  const result = await caller.getUser({
    id: user.id,
  });

  expect(result).toStrictEqual(user);

  await teardown();
});

test('it gets a user by email', async () => {
  const { caller, teardown, user } = await setupTest();

  const result = await caller.getUser({
    email: user.email,
  });

  expect(result).toStrictEqual(user);

  await teardown();
});

test('it returns null for a non-existent user', async () => {
  const { caller, teardown } = await setupTest();

  const result = await caller.getUser({
    id: 'non-existent-id',
  });

  expect(result).toBeNull();

  await teardown();
});
