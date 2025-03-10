import { expect, test } from 'vitest';
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

test('it verifies a correct password', async () => {
  const { caller, db, teardown } = await setupTest();

  const user = await createTestUser({ db, user: { password: 'password123' } });

  const result = await caller.verifyPassword({
    email: user.email,
    password: 'password123',
  });

  expect(result).toStrictEqual({ success: true });

  await teardown();
});

test('it returns a failure payload when the password is incorrect', async () => {
  const { caller, db, teardown } = await setupTest();

  const user = await createTestUser({ db, user: { password: 'password123' } });

  const result = await caller.verifyPassword({
    email: user.email,
    password: 'wrongpassword',
  });

  expect(result).toStrictEqual({ success: false });

  await teardown();
});

test('it rejects a non-existent user', async () => {
  const { caller, teardown } = await setupTest();

  await expect(
    caller.verifyPassword({
      email: 'nonexistent@test.com',
      password: 'password123',
    }),
  ).rejects.toMatchObject({
    code: 'NOT_FOUND',
    message: 'No user with that email',
  });

  await teardown();
});

test('it rejects a user without a password set', async () => {
  const { caller, db, teardown } = await setupTest();

  const user = await createTestUser({ db, user: { password: null } });

  await expect(
    caller.verifyPassword({
      email: user.email,
      password: 'password123',
    }),
  ).rejects.toMatchObject({
    code: 'BAD_REQUEST',
    message: 'User does not have a password set',
  });

  await teardown();
});
