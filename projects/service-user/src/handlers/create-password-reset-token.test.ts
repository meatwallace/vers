import { expect, test } from 'vitest';
import * as schema from '@vers/postgres-schema';
import { createTestUser, PostgresTestUtils } from '@vers/service-test-utils';
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

test('it creates a password reset token for an existing user', async () => {
  const { caller, db, teardown, user } = await setupTest();

  const result = await caller.createPasswordResetToken({
    id: user.id,
  });

  expect(result).toStrictEqual({
    resetToken: expect.any(String),
  });

  const updatedUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, user.id),
  });

  expect(updatedUser?.passwordResetToken).toBe(result.resetToken);
  expect(updatedUser?.passwordResetTokenExpiresAt).toBeDate();
  expect(updatedUser?.passwordResetTokenExpiresAt).toBeAfter(new Date());
  expect(updatedUser?.passwordResetTokenExpiresAt).toBeBefore(
    new Date(Date.now() + 11 * 60 * 1000),
  );

  await teardown();
});

test('it updates the user record with the new reset token', async () => {
  const { caller, db, teardown, user } = await setupTest();

  const firstResult = await caller.createPasswordResetToken({
    id: user.id,
  });

  const secondResult = await caller.createPasswordResetToken({
    id: user.id,
  });

  expect(firstResult.resetToken).not.toBe(secondResult.resetToken);

  const updatedUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, user.id),
  });

  expect(updatedUser?.passwordResetToken).toBe(secondResult.resetToken);

  await teardown();
});

test('it throws an error if the user does not exist', async () => {
  const { caller, teardown } = await setupTest();

  await expect(
    caller.createPasswordResetToken({
      id: 'nonexistent_id',
    }),
  ).rejects.toMatchObject({
    code: 'NOT_FOUND',
    message: 'User not found',
  });

  await teardown();
});

test('it throws an error if the user has no password', async () => {
  const { caller, teardown, user } = await setupTest({
    user: {
      passwordHash: null,
    },
  });

  await expect(
    caller.createPasswordResetToken({
      id: user.id,
    }),
  ).rejects.toMatchObject({
    code: 'BAD_REQUEST',
    message: 'User has no password',
  });

  await teardown();
});
