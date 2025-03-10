import { expect, test } from 'vitest';
import * as schema from '@vers/postgres-schema';
import { createTestUser, PostgresTestUtils } from '@vers/service-test-utils';
import bcrypt from 'bcryptjs';
import invariant from 'tiny-invariant';
import { pgTestConfig } from '../pg-test-config';
import { router } from '../router';
import { t } from '../t';

const createCaller = t.createCallerFactory(router);

interface TestConfig {
  user?: Partial<typeof schema.users.$inferInsert>;
}

async function setupTest(config: TestConfig = {}) {
  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const user = await createTestUser({ db, user: config.user });

  const caller = createCaller({ db });

  return { caller, db, teardown, user };
}

test('it updates the password and clears the reset token for an existing user', async () => {
  const { caller, db, teardown, user } = await setupTest({
    user: {
      passwordResetToken: 'test_reset_token',
      passwordResetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 10),
    },
  });

  const result = await caller.changePassword({
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

  await teardown();
});

test('it throws an error if the user does not exist', async () => {
  const { caller, teardown } = await setupTest();

  await expect(
    caller.changePassword({
      id: 'nonexistent_id',
      password: 'newpassword123',
      resetToken: 'test_reset_token',
    }),
  ).rejects.toMatchObject({
    code: 'NOT_FOUND',
    message: 'No user with that ID',
  });

  await teardown();
});

test('it throws an error if the reset token is invalid', async () => {
  const { caller, teardown, user } = await setupTest({
    user: {
      passwordResetToken: 'test_reset_token',
      passwordResetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 10),
    },
  });

  await expect(
    caller.changePassword({
      id: user.id,
      password: 'newpassword123',
      resetToken: 'invalid_reset_token',
    }),
  ).rejects.toMatchObject({
    code: 'BAD_REQUEST',
    message: 'Invalid reset token',
  });

  await teardown();
});

test('it throws an error if the reset token has expired', async () => {
  const { caller, teardown, user } = await setupTest({
    user: {
      passwordResetToken: 'test_reset_token',
      passwordResetTokenExpiresAt: new Date(Date.now() - 1000 * 60 * 10),
    },
  });

  await expect(
    caller.changePassword({
      id: user.id,
      password: 'newpassword123',
      resetToken: 'test_reset_token',
    }),
  ).rejects.toMatchObject({
    code: 'BAD_REQUEST',
    message: 'Reset token expired',
  });

  await teardown();
});
