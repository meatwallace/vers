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
    target: 'user@test.com',
    ipAddress: ctx.ipAddress,
    action: VerificationType.ONBOARDING,
    sessionID: null,
  });

  const transactionToken = await createTransactionToken(
    {
      target: 'user@test.com',
      action: VerificationType.ONBOARDING,
      ipAddress: ctx.ipAddress,
      transactionID,
      sessionID: null,
    },
    ctx,
  );

  const args = {
    input: {
      email: 'user@test.com',
      name: 'Test User',
      username: 'test_user',
      password: 'password123',
      rememberMe: true,
      transactionToken,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    accessToken: expect.any(String),
    refreshToken: expect.any(String),
    session: {
      id: expect.any(String),
      userID: expect.any(String),
      ipAddress: ctx.ipAddress,
      expiresAt: expect.any(Date),
    },
  });

  const user = db.user.findFirst({
    where: { email: { equals: args.input.email } },
  });

  expect(user).toMatchObject({
    email: args.input.email,
    name: args.input.name,
    username: args.input.username,
  });
});

test('it returns an error if the transaction token is invalid', async () => {
  const ctx = createMockGQLContext({});
  const args = {
    input: {
      email: 'user@test.com',
      name: 'Test User',
      username: 'test_user',
      password: 'password123',
      rememberMe: true,
      transactionToken: 'invalid',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    error: {
      title: 'Failed Verification',
      message: 'Verification for this operation is invalid or has expired.',
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
    target: 'user@test.com',
    ipAddress: ctx.ipAddress,
    action: VerificationType.ONBOARDING,
    sessionID: null,
  });

  db.user.create({
    email: 'user@test.com',
    name: 'Existing User',
    username: 'existing_user',
  });

  const transactionToken = await createTransactionToken(
    {
      target: 'user@test.com',
      action: VerificationType.ONBOARDING,
      ipAddress: ctx.ipAddress,
      transactionID,
      sessionID: null,
    },
    ctx,
  );

  const args = {
    input: {
      email: 'user@test.com',
      name: 'Test User',
      username: 'test_user',
      password: 'password123',
      rememberMe: true,
      transactionToken,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    error: {
      title: 'An unknown error occurred',
      message: 'An unknown error occurred',
    },
  });

  // Verify the existing user was not modified
  const user = db.user.findFirst({
    where: { email: { equals: args.input.email } },
  });

  expect(user).toMatchObject({
    name: 'Existing User',
    username: 'existing_user',
  });
});
