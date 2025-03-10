import { expect, test } from 'vitest';
import { PostgresTestUtils } from '@vers/service-test-utils';
import bcrypt from 'bcryptjs';
import invariant from 'tiny-invariant';
import { pgTestConfig } from '../pg-test-config';
import { router } from '../router';
import { t } from '../t';

const createCaller = t.createCallerFactory(router);

async function setupTest() {
  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const caller = createCaller({ db });

  return { caller, db, teardown };
}

test('it creates a user with a hashed password', async () => {
  const { caller, db, teardown } = await setupTest();

  const password = 'password123';

  const result = await caller.createUser({
    email: 'user@test.com',
    name: 'Test User',
    password,
    username: 'test_user',
  });

  expect(result).toStrictEqual({
    createdAt: expect.any(Date),
    email: 'user@test.com',
    id: expect.any(String),
    name: 'Test User',
    updatedAt: expect.any(Date),
    username: 'test_user',
  });

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, 'user@test.com'),
  });

  invariant(user?.passwordHash, 'user with password hash must be created');

  await expect(
    bcrypt.compare(password, user.passwordHash),
  ).resolves.toBeTruthy();

  await teardown();
});

test('it throws an error if a user with that email already exists', async () => {
  const { caller, teardown } = await setupTest();

  await caller.createUser({
    email: 'user@test.com',
    name: 'Test User',
    password: 'password123',
    username: 'test_user',
  });

  // try to create another user with the same email
  await expect(
    caller.createUser({
      email: 'user@test.com',
      name: 'Another User',
      password: 'password456',
      username: 'another_user',
    }),
  ).rejects.toMatchObject({
    code: 'CONFLICT',
    message: 'A user with that email already exists',
  });

  await teardown();
});

test('it throws an error if a user with that username already exists', async () => {
  const { caller, teardown } = await setupTest();

  await caller.createUser({
    email: 'user1@test.com',
    name: 'Test User',
    password: 'password123',
    username: 'test_user',
  });

  // try to create another user with the same username
  await expect(
    caller.createUser({
      email: 'user2@test.com',
      name: 'Another User',
      password: 'password456',
      username: 'test_user',
    }),
  ).rejects.toMatchObject({
    code: 'CONFLICT',
    message: 'A user with that username already exists',
  });

  await teardown();
});
