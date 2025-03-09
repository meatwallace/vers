import invariant from 'tiny-invariant';
import { afterEach, expect, test } from 'vitest';
import { db } from '~/mocks/db';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { createPendingTransaction } from '~/utils/create-pending-transaction';
import { verifyTransactionToken } from '~/utils/verify-transaction-token';
import { generateTOTP } from '@epic-web/totp';
import { drop } from '@mswjs/data';
import { VerificationType } from '../types/verification-type';
import { resolve } from './verify-otp';

afterEach(() => {
  drop(db);
});

test('it verifies a valid onboarding otp and returns a valid transaction token', async () => {
  const ctx = createMockGQLContext({});

  const transactionID = createPendingTransaction({
    target: 'test@example.com',
    ipAddress: ctx.ipAddress,
    action: VerificationType.ONBOARDING,
    sessionID: null,
  });

  const { otp, ...verificationConfig } = await generateTOTP({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
  });

  db.verification.create({
    type: 'onboarding',
    target: 'test@example.com',
    ...verificationConfig,
  });

  const args = {
    input: {
      code: otp,
      type: VerificationType.ONBOARDING,
      target: 'test@example.com',
      transactionID,
      sessionID: null,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    transactionToken: expect.any(String),
  });

  invariant('transactionToken' in result);

  const isValid = await verifyTransactionToken(
    {
      token: result.transactionToken,
      action: VerificationType.ONBOARDING,
      target: 'test@example.com',
    },
    ctx,
  );

  expect(isValid).toMatchObject({
    transaction_id: transactionID,
  });
});

test('it verifies a valid change email otp and returns a valid transaction token', async () => {
  const session = db.session.create();

  const ctx = createMockGQLContext({ session });

  const transactionID = createPendingTransaction({
    target: 'test@example.com',
    ipAddress: ctx.ipAddress,
    action: VerificationType.CHANGE_EMAIL,
    sessionID: session.id,
  });

  const { otp, ...verificationConfig } = await generateTOTP({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
  });

  db.verification.create({
    type: '2fa',
    target: 'test@example.com',
    ...verificationConfig,
  });

  const args = {
    input: {
      code: otp,
      type: VerificationType.CHANGE_EMAIL,
      target: 'test@example.com',
      transactionID,
      sessionID: session.id,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    transactionToken: expect.any(String),
  });

  invariant('transactionToken' in result);

  const isValid = await verifyTransactionToken(
    {
      token: result.transactionToken,
      action: VerificationType.CHANGE_EMAIL,
      target: 'test@example.com',
    },
    ctx,
  );

  expect(isValid).toMatchObject({
    transaction_id: transactionID,
  });
});

test('it verifies a valid change password otp and returns a valid transaction token', async () => {
  const session = db.session.create();

  const ctx = createMockGQLContext({ session });

  const transactionID = createPendingTransaction({
    target: 'test@example.com',
    ipAddress: ctx.ipAddress,
    action: VerificationType.CHANGE_PASSWORD,
    sessionID: session.id,
  });

  const { otp, ...verificationConfig } = await generateTOTP({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
  });

  db.verification.create({
    type: '2fa',
    target: 'test@example.com',
    ...verificationConfig,
  });

  const args = {
    input: {
      code: otp,
      type: VerificationType.CHANGE_PASSWORD,
      target: 'test@example.com',
      transactionID,
      sessionID: session.id,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    transactionToken: expect.any(String),
  });

  invariant('transactionToken' in result);

  const isValid = await verifyTransactionToken(
    {
      token: result.transactionToken,
      action: VerificationType.CHANGE_PASSWORD,
      target: 'test@example.com',
    },
    ctx,
  );

  expect(isValid).toMatchObject({
    transaction_id: transactionID,
  });
});

test('it verifies a valid reset password otp and returns a valid transaction token', async () => {
  const ctx = createMockGQLContext({});

  const transactionID = createPendingTransaction({
    target: 'test@example.com',
    ipAddress: ctx.ipAddress,
    action: VerificationType.RESET_PASSWORD,
    sessionID: null,
  });

  const { otp, ...verificationConfig } = await generateTOTP({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
  });

  db.verification.create({
    type: '2fa',
    target: 'test@example.com',
    ...verificationConfig,
  });

  const args = {
    input: {
      code: otp,
      type: VerificationType.RESET_PASSWORD,
      target: 'test@example.com',
      transactionID,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    transactionToken: expect.any(String),
  });

  invariant('transactionToken' in result);

  const isValid = await verifyTransactionToken(
    {
      token: result.transactionToken,
      action: VerificationType.RESET_PASSWORD,
      target: 'test@example.com',
    },
    ctx,
  );

  expect(isValid).toMatchObject({
    transaction_id: transactionID,
  });
});

test('it verifies a valid change email confirmation otp and returns a valid transaction token', async () => {
  const ctx = createMockGQLContext({});

  const transactionID = createPendingTransaction({
    target: 'test@example.com',
    ipAddress: ctx.ipAddress,
    action: VerificationType.CHANGE_EMAIL_CONFIRMATION,
    sessionID: null,
  });

  const { otp, ...verificationConfig } = await generateTOTP({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
  });

  db.verification.create({
    type: 'change-email',
    target: 'test@example.com',
    ...verificationConfig,
  });

  const args = {
    input: {
      code: otp,
      type: VerificationType.CHANGE_EMAIL_CONFIRMATION,
      target: 'test@example.com',
      transactionID,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    transactionToken: expect.any(String),
  });

  invariant('transactionToken' in result);

  const isValid = await verifyTransactionToken(
    {
      token: result.transactionToken,
      action: VerificationType.CHANGE_EMAIL_CONFIRMATION,
      target: 'test@example.com',
    },
    ctx,
  );

  expect(isValid).toMatchObject({
    transaction_id: transactionID,
  });
});

test('it throws an error if session validation fails', async () => {
  const ctx = createMockGQLContext({});

  const session = db.session.create({
    ipAddress: ctx.ipAddress,
  });

  const transactionID = createPendingTransaction({
    target: 'test@example.com',
    ipAddress: ctx.ipAddress,
    action: VerificationType.TWO_FACTOR_AUTH,
    sessionID: session.id,
  });

  const { otp, ...verificationConfig } = await generateTOTP({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
  });

  db.verification.create({
    type: '2fa',
    target: 'test@example.com',
    ...verificationConfig,
  });

  const args = {
    input: {
      code: otp,
      type: VerificationType.TWO_FACTOR_AUTH,
      target: 'test@example.com',
      transactionID,
      sessionID: 'non_existent_session',
    },
  };

  await expect(() => resolve({}, args, ctx)).rejects.toThrow(
    'An unknown error occurred',
  );
});

test('it returns an error for an invalid OTP', async () => {
  const ctx = createMockGQLContext({});

  const transactionID = createPendingTransaction({
    target: 'test@example.com',
    ipAddress: ctx.ipAddress,
    action: VerificationType.ONBOARDING,
    sessionID: null,
  });

  const { otp, ...verificationConfig } = await generateTOTP({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
  });

  db.verification.create({
    type: '2fa',
    target: 'test@example.com',
    ...verificationConfig,
  });

  const args = {
    input: {
      code: 'invalid',
      type: VerificationType.ONBOARDING,
      target: 'test@example.com',
      transactionID,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    error: {
      title: 'Invalid OTP',
      message: 'Invalid verification code',
    },
  });
});

test('it returns an error if verification does not exist', async () => {
  const ctx = createMockGQLContext({});

  const transactionID = createPendingTransaction({
    target: 'nonexistent@example.com',
    ipAddress: ctx.ipAddress,
    action: VerificationType.ONBOARDING,
    sessionID: null,
  });

  const args = {
    input: {
      code: '999123',
      type: VerificationType.ONBOARDING,
      target: 'nonexistent@example.com',
      transactionID,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    error: {
      title: 'Invalid OTP',
      message: 'Invalid verification code',
    },
  });
});
