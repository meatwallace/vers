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
    username: 'test_user',
  });

  expect(user.email).toBe('test@test.com');
  expect(user.name).toBe('Test User');
  expect(user.username).toBe('test_user');
});
