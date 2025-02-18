import { afterEach, expect, test } from 'vitest';
import { drop } from '@mswjs/data';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { db } from '~/mocks/db';
import { resolve } from './start-password-reset';

afterEach(() => {
  drop(db);
});

test('it creates a verification for an existing user', async () => {
  db.user.create({
    email: 'test@example.com',
    passwordHash: 'hashed_password',
    passwordResetToken: null,
    passwordResetTokenExpiresAt: null,
  });

  const ctx = createMockGQLContext({});

  const args = {
    input: {
      email: 'test@example.com',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    success: true,
  });

  const verification = db.verification.findFirst({
    where: {
      target: { equals: 'test@example.com' },
      type: {
        equals: 'reset-password',
      },
    },
  });

  const user = db.user.findFirst({
    where: {
      email: { equals: 'test@example.com' },
    },
  });

  expect(verification?.createdAt).toBeDefined();
  expect(user?.passwordResetToken).toBeDefined();
  expect(user?.passwordResetTokenExpiresAt).toBeDefined();
});

test('it returns success for non-existent user (to prevent user enumeration)', async () => {
  const ctx = createMockGQLContext({});

  const args = {
    input: {
      email: 'nonexistent@example.com',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    success: true,
  });

  const verification = db.verification.findFirst({
    where: {
      target: { equals: 'nonexistent@example.com' },
    },
  });

  expect(verification).toBeNull();
});
