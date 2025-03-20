import { afterEach, expect, test } from 'vitest';
import { generateTOTP } from '@epic-web/totp';
import { drop } from '@mswjs/data';
import invariant from 'tiny-invariant';
import { db } from '~/mocks/db';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { createPendingTransaction } from '~/utils/create-pending-transaction';
import { verifyTransactionToken } from '~/utils/verify-transaction-token';
import { VerificationType } from '../types/verification-type';
import { resolve } from './verify-otp';

afterEach(() => {
  drop(db);
});

test('it verifies a valid onboarding otp and returns a valid transaction token', async () => {
  const ctx = createMockGQLContext({});

  const transactionID = createPendingTransaction({
    action: VerificationType.ONBOARDING,
    ipAddress: ctx.ipAddress,
    sessionID: null,
    target: 'test@example.com',
  });

  const { otp, ...verificationConfig } = await generateTOTP({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
  });

  db.verification.create({
    target: 'test@example.com',
    type: 'onboarding',
    ...verificationConfig,
  });

  const args = {
    input: {
      code: otp,
      sessionID: null,
      target: 'test@example.com',
      transactionID,
      type: VerificationType.ONBOARDING,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toStrictEqual({
    transactionToken: expect.any(String),
  });

  invariant('transactionToken' in result);

  const isValid = await verifyTransactionToken(
    {
      action: VerificationType.ONBOARDING,
      target: 'test@example.com',
      token: result.transactionToken,
    },
    ctx,
  );

  expect(isValid).toStrictEqual({
    action: VerificationType.ONBOARDING,
    amr: ['otp'],
    auth_time: expect.any(Number),
    ip_address: ctx.ipAddress,
    jti: expect.any(String),
    mfa_verified: true,
    session_id: null,
    sub: 'test@example.com',
    transaction_id: transactionID,
  });
});

test('it verifies a valid change email otp and returns a valid transaction token', async () => {
  const session = db.session.create();

  const ctx = createMockGQLContext({ session });

  const transactionID = createPendingTransaction({
    action: VerificationType.CHANGE_EMAIL,
    ipAddress: ctx.ipAddress,
    sessionID: session.id,
    target: 'test@example.com',
  });

  const { otp, ...verificationConfig } = await generateTOTP({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
  });

  db.verification.create({
    target: 'test@example.com',
    type: '2fa',
    ...verificationConfig,
  });

  const args = {
    input: {
      code: otp,
      sessionID: session.id,
      target: 'test@example.com',
      transactionID,
      type: VerificationType.CHANGE_EMAIL,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toStrictEqual({
    transactionToken: expect.any(String),
  });

  invariant('transactionToken' in result);

  const isValid = await verifyTransactionToken(
    {
      action: VerificationType.CHANGE_EMAIL,
      target: 'test@example.com',
      token: result.transactionToken,
    },
    ctx,
  );

  expect(isValid).toStrictEqual({
    action: VerificationType.CHANGE_EMAIL,
    amr: ['otp'],
    auth_time: expect.any(Number),
    ip_address: ctx.ipAddress,
    jti: expect.any(String),
    mfa_verified: true,
    session_id: session.id,
    sub: 'test@example.com',
    transaction_id: transactionID,
  });
});

test('it verifies a valid change password otp and returns a valid transaction token', async () => {
  const session = db.session.create();

  const ctx = createMockGQLContext({ session });

  const transactionID = createPendingTransaction({
    action: VerificationType.CHANGE_PASSWORD,
    ipAddress: ctx.ipAddress,
    sessionID: session.id,
    target: 'test@example.com',
  });

  const { otp, ...verificationConfig } = await generateTOTP({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
  });

  db.verification.create({
    target: 'test@example.com',
    type: '2fa',
    ...verificationConfig,
  });

  const args = {
    input: {
      code: otp,
      sessionID: session.id,
      target: 'test@example.com',
      transactionID,
      type: VerificationType.CHANGE_PASSWORD,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toStrictEqual({
    transactionToken: expect.any(String),
  });

  invariant('transactionToken' in result);

  const isValid = await verifyTransactionToken(
    {
      action: VerificationType.CHANGE_PASSWORD,
      target: 'test@example.com',
      token: result.transactionToken,
    },
    ctx,
  );

  expect(isValid).toStrictEqual({
    action: VerificationType.CHANGE_PASSWORD,
    amr: ['otp'],
    auth_time: expect.any(Number),
    ip_address: ctx.ipAddress,
    jti: expect.any(String),
    mfa_verified: true,
    session_id: session.id,
    sub: 'test@example.com',
    transaction_id: transactionID,
  });
});

test('it verifies a valid reset password otp and returns a valid transaction token', async () => {
  const ctx = createMockGQLContext({});

  const transactionID = createPendingTransaction({
    action: VerificationType.RESET_PASSWORD,
    ipAddress: ctx.ipAddress,
    sessionID: null,
    target: 'test@example.com',
  });

  const { otp, ...verificationConfig } = await generateTOTP({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
  });

  db.verification.create({
    target: 'test@example.com',
    type: '2fa',
    ...verificationConfig,
  });

  const args = {
    input: {
      code: otp,
      target: 'test@example.com',
      transactionID,
      type: VerificationType.RESET_PASSWORD,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toStrictEqual({
    transactionToken: expect.any(String),
  });

  invariant('transactionToken' in result);

  const isValid = await verifyTransactionToken(
    {
      action: VerificationType.RESET_PASSWORD,
      target: 'test@example.com',
      token: result.transactionToken,
    },
    ctx,
  );

  expect(isValid).toStrictEqual({
    action: VerificationType.RESET_PASSWORD,
    amr: ['otp'],
    auth_time: expect.any(Number),
    ip_address: ctx.ipAddress,
    jti: expect.any(String),
    mfa_verified: true,
    session_id: null,
    sub: 'test@example.com',
    transaction_id: transactionID,
  });
});

test('it verifies a valid change email confirmation otp and returns a valid transaction token', async () => {
  const user = db.user.create();
  const session = db.session.create({ userID: user.id });

  const ctx = createMockGQLContext({ session });

  const transactionID = createPendingTransaction({
    action: VerificationType.CHANGE_EMAIL_CONFIRMATION,
    ipAddress: ctx.ipAddress,
    sessionID: session.id,
    target: 'test@example.com',
  });

  const { otp, ...verificationConfig } = await generateTOTP({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
  });

  db.verification.create({
    target: 'test@example.com',
    type: 'change-email',
    ...verificationConfig,
  });

  const args = {
    input: {
      code: otp,
      sessionID: session.id,
      target: 'test@example.com',
      transactionID,
      type: VerificationType.CHANGE_EMAIL_CONFIRMATION,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toStrictEqual({
    transactionToken: expect.any(String),
  });

  invariant('transactionToken' in result);

  const isValid = await verifyTransactionToken(
    {
      action: VerificationType.CHANGE_EMAIL_CONFIRMATION,
      target: 'test@example.com',
      token: result.transactionToken,
    },
    ctx,
  );

  expect(isValid).toStrictEqual({
    action: VerificationType.CHANGE_EMAIL_CONFIRMATION,
    amr: ['otp'],
    auth_time: expect.any(Number),
    ip_address: ctx.ipAddress,
    jti: expect.any(String),
    mfa_verified: true,
    session_id: session.id,
    sub: 'test@example.com',
    transaction_id: transactionID,
  });
});

test('it throws an error if session validation fails', async () => {
  const ctx = createMockGQLContext({});

  const session = db.session.create({
    ipAddress: ctx.ipAddress,
  });

  const transactionID = createPendingTransaction({
    action: VerificationType.TWO_FACTOR_AUTH,
    ipAddress: ctx.ipAddress,
    sessionID: session.id,
    target: 'test@example.com',
  });

  const { otp, ...verificationConfig } = await generateTOTP({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
  });

  db.verification.create({
    target: 'test@example.com',
    type: '2fa',
    ...verificationConfig,
  });

  const args = {
    input: {
      code: otp,
      sessionID: 'non_existent_session',
      target: 'test@example.com',
      transactionID,
      type: VerificationType.TWO_FACTOR_AUTH,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toStrictEqual({
    error: {
      message: 'An unknown error occurred',
      title: 'Unknown error occurred',
    },
  });
});

test('it returns an error for an invalid OTP', async () => {
  const ctx = createMockGQLContext({});

  const transactionID = createPendingTransaction({
    action: VerificationType.ONBOARDING,
    ipAddress: ctx.ipAddress,
    sessionID: null,
    target: 'test@example.com',
  });

  const { otp, ...verificationConfig } = await generateTOTP({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
  });

  db.verification.create({
    target: 'test@example.com',
    type: '2fa',
    ...verificationConfig,
  });

  const args = {
    input: {
      code: 'invalid',
      target: 'test@example.com',
      transactionID,
      type: VerificationType.ONBOARDING,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toStrictEqual({
    error: {
      message: 'An unknown error occurred',
      title: 'Unknown error occurred',
    },
  });
});

test('it returns an error if verification does not exist', async () => {
  const ctx = createMockGQLContext({});

  const transactionID = createPendingTransaction({
    action: VerificationType.ONBOARDING,
    ipAddress: ctx.ipAddress,
    sessionID: null,
    target: 'nonexistent@example.com',
  });

  const args = {
    input: {
      code: '999123',
      target: 'nonexistent@example.com',
      transactionID,
      type: VerificationType.ONBOARDING,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toStrictEqual({
    error: {
      message: 'An unknown error occurred',
      title: 'Unknown error occurred',
    },
  });
});
