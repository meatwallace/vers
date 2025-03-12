import { afterEach, expect, test } from 'vitest';
import { drop } from '@mswjs/data';
import { db } from '~/mocks/db';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { createPendingTransaction } from '~/utils/create-pending-transaction';
import { createTransactionToken } from '~/utils/create-transaction-token';
import { VerificationType } from '../types/verification-type';
import { resolve } from './finish-email-sign-up';

afterEach(() => {
  drop(db);
});

test('it completes the email signup process when transaction token is valid', async () => {
  const ctx = createMockGQLContext({});

  const transactionID = createPendingTransaction({
    action: VerificationType.ONBOARDING,
    ipAddress: ctx.ipAddress,
    sessionID: null,
    target: 'user@test.com',
  });

  const transactionToken = await createTransactionToken(
    {
      action: VerificationType.ONBOARDING,
      ipAddress: ctx.ipAddress,
      sessionID: null,
      target: 'user@test.com',
      transactionID,
    },
    ctx,
  );

  const args = {
    input: {
      email: 'user@test.com',
      name: 'Test User',
      password: 'password123',
      rememberMe: true,
      transactionToken,
      username: 'test_user',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toStrictEqual({
    accessToken: expect.any(String),
    refreshToken: expect.any(String),
    session: {
      createdAt: expect.any(Date),
      expiresAt: expect.any(Date),
      id: expect.any(String),
      ipAddress: ctx.ipAddress,
      updatedAt: expect.any(Date),
      userID: expect.any(String),
    },
  });

  const user = db.user.findFirst({
    where: { email: { equals: args.input.email } },
  });

  expect(user).toMatchObject({
    createdAt: expect.any(Date),
    email: args.input.email,
    id: expect.any(String),
    name: args.input.name,
    passwordHash: null,
    passwordResetToken: null,
    passwordResetTokenExpiresAt: null,
    updatedAt: expect.any(Date),
    username: args.input.username,
  });
});

test('it returns an error if the transaction token is invalid', async () => {
  const ctx = createMockGQLContext({});
  const args = {
    input: {
      email: 'user@test.com',
      name: 'Test User',
      password: 'password123',
      rememberMe: true,
      transactionToken: 'invalid',
      username: 'test_user',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toStrictEqual({
    error: {
      message: 'An unknown error occurred',
      title: 'Unknown error occurred',
    },
  });

  // Verify no user was created
  const user = db.user.findFirst({
    where: { email: { equals: args.input.email } },
  });

  expect(user).toBeNull();
});

test('it returns an ambiguous error if the user already exists', async () => {
  const ctx = createMockGQLContext({});

  const transactionID = createPendingTransaction({
    action: VerificationType.ONBOARDING,
    ipAddress: ctx.ipAddress,
    sessionID: null,
    target: 'user@test.com',
  });

  const initialUser = db.user.create({
    email: 'user@test.com',
    name: 'Existing User',
    username: 'existing_user',
  });

  const transactionToken = await createTransactionToken(
    {
      action: VerificationType.ONBOARDING,
      ipAddress: ctx.ipAddress,
      sessionID: null,
      target: 'user@test.com',
      transactionID,
    },
    ctx,
  );

  const args = {
    input: {
      email: 'user@test.com',
      name: 'Test User',
      password: 'password123',
      rememberMe: true,
      transactionToken,
      username: 'test_user',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toStrictEqual({
    error: {
      message: 'An unknown error occurred',
      title: 'Unknown error occurred',
    },
  });

  // Verify the existing user was not modified
  const user = db.user.findFirst({
    where: { email: { equals: args.input.email } },
  });

  expect(user).toStrictEqual(initialUser);
});
