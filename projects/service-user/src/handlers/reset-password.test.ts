import { expect, test } from 'vitest';
import * as schema from '@vers/postgres-schema';
import { createTestDB, createTestUser } from '@vers/service-test-utils';
import bcrypt from 'bcryptjs';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import invariant from 'tiny-invariant';
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

test('it updates the password and clears the reset token for an existing user', async () => {
  await using handle = await createTestDB();

  const { db } = handle;

  const user = await createTestUser({
    db,
    user: {
      passwordResetToken: 'test_reset_token',
      passwordResetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 10),
    },
  });

  const { caller } = setupTest({ db });

  const result = await caller.resetPassword({
    id: user.id,
    password: 'newpassword123',
    resetToken: 'test_reset_token',
  });

  expect(result).toStrictEqual({});

  const updatedUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, user.id),
  });

  invariant(
    typeof updatedUser?.passwordHash === 'string',
    'updated user password hash must set',
  );

  await expect(
    bcrypt.compare('newpassword123', updatedUser.passwordHash),
  ).resolves.toBeTrue();

  expect(updatedUser.passwordResetToken).toBeNull();
  expect(updatedUser.passwordResetTokenExpiresAt).toBeNull();
});

test('it throws an error if the user does not exist', async () => {
  await using handle = await createTestDB();

  const { db } = handle;

  const { caller } = setupTest({ db });

  await expect(
    caller.resetPassword({
      id: 'nonexistent_id',
      password: 'newpassword123',
      resetToken: 'test_reset_token',
    }),
  ).rejects.toMatchObject({
    code: 'NOT_FOUND',
    message: 'No user with that ID',
  });
});

test('it throws an error if the reset token is invalid', async () => {
  await using handle = await createTestDB();

  const { db } = handle;

  const user = await createTestUser({
    db,
    user: {
      passwordResetToken: 'test_reset_token',
      passwordResetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 10),
    },
  });

  const { caller } = setupTest({ db });

  await expect(
    caller.resetPassword({
      id: user.id,
      password: 'newpassword123',
      resetToken: 'invalid_reset_token',
    }),
  ).rejects.toMatchObject({
    code: 'BAD_REQUEST',
    message: 'Invalid reset token',
  });
});

test('it throws an error if the reset token has expired', async () => {
  await using handle = await createTestDB();

  const { db } = handle;

  const user = await createTestUser({
    db,
    user: {
      passwordResetToken: 'test_reset_token',
      passwordResetTokenExpiresAt: new Date(Date.now() - 1000 * 60 * 10),
    },
  });

  const { caller } = setupTest({ db });

  await expect(
    caller.resetPassword({
      id: user.id,
      password: 'newpassword123',
      resetToken: 'test_reset_token',
    }),
  ).rejects.toMatchObject({
    code: 'BAD_REQUEST',
    message: 'Reset token expired',
  });
});
