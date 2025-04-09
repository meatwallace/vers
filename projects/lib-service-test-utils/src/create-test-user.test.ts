import { expect, test } from 'vitest';
import { createTestDB } from './create-test-db';
import { createTestUser } from './create-test-user';

test('it creates a test user with the expected data', async () => {
  await using handle = await createTestDB();

  const { db } = handle;

  const user = await createTestUser(db);

  expect(user).toStrictEqual({
    createdAt: expect.any(Date),
    email: 'user@test.com',
    id: expect.any(String),
    name: 'Test User',
    passwordHash: expect.any(String),
    passwordResetToken: null,
    passwordResetTokenExpiresAt: null,
    seed: expect.any(Number),
    updatedAt: expect.any(Date),
    username: 'test_user',
  });
});

test('it creates a passwordless user when password is null', async () => {
  await using handle = await createTestDB();

  const { db } = handle;

  const user = await createTestUser(db, { password: null });

  expect(user.passwordHash).toBeNull();
});

test('it allows overriding the default user data', async () => {
  await using handle = await createTestDB();

  const { db } = handle;

  const user = await createTestUser(db, {
    email: 'test@test.com',
    name: 'Test User',
    seed: 123,
    username: 'test_user',
  });

  expect(user).toStrictEqual({
    createdAt: expect.any(Date),
    email: 'test@test.com',
    id: expect.any(String),
    name: 'Test User',
    passwordHash: expect.any(String),
    passwordResetToken: null,
    passwordResetTokenExpiresAt: null,
    seed: 123,
    updatedAt: expect.any(Date),
    username: 'test_user',
  });
});
