import { afterEach, expect, test } from 'vitest';
import * as jose from 'jose';
import invariant from 'tiny-invariant';
import { drop } from '@mswjs/data';
import { db } from '~/mocks/db';
import { VerificationType } from '~/schema/types/verification-type';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { env } from '../env';
import { createPendingTransaction } from './create-pending-transaction';
import { createTransactionToken } from './create-transaction-token';
import { pendingTransactionCache } from './pending-transaction-cache';

afterEach(() => {
  drop(db);
});

test('it creates a valid transaction token with required data', async () => {
  const transactionID = createPendingTransaction({
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.TWO_FACTOR_AUTH,
    sessionID: null,
  });

  const data = {
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.TWO_FACTOR_AUTH,
    transactionID,
    sessionID: null,
  };

  const ctx = createMockGQLContext({});

  const token = await createTransactionToken(data, ctx);
  const key = await jose.importPKCS8(env.JWT_SIGNING_SECRET, 'RS256');

  const verifiedToken = await jose.jwtVerify(token, key, {
    issuer: env.API_IDENTIFIER,
    audience: env.API_IDENTIFIER,
    algorithms: ['RS256'],
    maxTokenAge: '5 minutes',
    requiredClaims: [
      'amr',
      'mfa_verified',
      'ip_address',
      'auth_time',
      'action',
      'transaction_id',
      'session_id',
    ],
  });

  expect(verifiedToken.payload).toMatchObject({
    sub: data.target,
    amr: ['otp'],
    mfa_verified: true,
    ip_address: data.ipAddress,
    action: data.action,
    session_id: null,
    iss: env.API_IDENTIFIER,
    aud: env.API_IDENTIFIER,
    auth_time: expect.any(Number),
    iat: expect.any(Number),
    exp: expect.any(Number),
    jti: expect.any(String),
  });
});

test('it creates a valid transaction token with session data', async () => {
  const session = db.session.create({
    userID: 'user_123',
    ipAddress: '127.0.0.1',
  });

  const transactionID = createPendingTransaction({
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.TWO_FACTOR_AUTH,
    sessionID: session.id,
  });

  const data = {
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.TWO_FACTOR_AUTH,
    transactionID,
    sessionID: session.id,
  };

  const ctx = createMockGQLContext({});
  const token = await createTransactionToken(data, ctx);
  const key = await jose.importPKCS8(env.JWT_SIGNING_SECRET, 'RS256');

  const verifiedToken = await jose.jwtVerify(token, key, {
    issuer: env.API_IDENTIFIER,
    audience: env.API_IDENTIFIER,
    algorithms: ['RS256'],
    maxTokenAge: '5 minutes',
    requiredClaims: [
      'amr',
      'mfa_verified',
      'ip_address',
      'auth_time',
      'action',
      'transaction_id',
      'session_id',
    ],
  });

  expect(verifiedToken.payload).toMatchObject({
    sub: data.target,
    amr: ['otp'],
    mfa_verified: true,
    ip_address: data.ipAddress,
    action: data.action,
    session_id: session.id,
    iss: env.API_IDENTIFIER,
    aud: env.API_IDENTIFIER,
  });
});

test('it throws an error when a pending transaction is not found', async () => {
  const data = {
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.TWO_FACTOR_AUTH,
    transactionID: 'invalid',
    sessionID: null,
  };

  const ctx = createMockGQLContext({});

  await expect(() => createTransactionToken(data, ctx)).rejects.toThrow(
    'Pending transaction not found',
  );
});

test('it throws an error when session is not found', async () => {
  const transactionID = createPendingTransaction({
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.TWO_FACTOR_AUTH,
    sessionID: null,
  });

  const data = {
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.TWO_FACTOR_AUTH,
    transactionID,
    sessionID: 'non_existent_session',
  };

  const ctx = createMockGQLContext({});

  await expect(() => createTransactionToken(data, ctx)).rejects.toThrow(
    'Session ID mismatch while creating transaction token',
  );
});

test.each([
  [VerificationType.TWO_FACTOR_AUTH, 2],
  [VerificationType.TWO_FACTOR_AUTH_SETUP, 2],
  [VerificationType.TWO_FACTOR_AUTH_DISABLE, 2],
  [VerificationType.ONBOARDING, 20],
  [VerificationType.CHANGE_EMAIL_CONFIRMATION, 20],
  [VerificationType.RESET_PASSWORD, 5],
  [VerificationType.CHANGE_EMAIL, 5],
  [VerificationType.CHANGE_PASSWORD, 5],
])(
  'it generates a %s transaction that expires after %d minutes',
  async (action, minutes) => {
    const transactionID = createPendingTransaction({
      target: 'user_123',
      ipAddress: '127.0.0.1',
      action,
      sessionID: null,
    });

    const data = {
      target: 'user_123',
      ipAddress: '127.0.0.1',
      action,
      transactionID,
      sessionID: null,
    };

    const ctx = createMockGQLContext({});
    const token = await createTransactionToken(data, ctx);
    const key = await jose.importPKCS8(env.JWT_SIGNING_SECRET, 'RS256');

    const verifiedToken = await jose.jwtVerify(token, key, {
      issuer: env.API_IDENTIFIER,
      audience: env.API_IDENTIFIER,
      algorithms: ['RS256'],
      maxTokenAge: '20 minutes',
      requiredClaims: [
        'amr',
        'mfa_verified',
        'ip_address',
        'auth_time',
        'action',
        'transaction_id',
        'session_id',
      ],
    });

    invariant(verifiedToken.payload.exp, 'Expiration time is required');
    invariant(verifiedToken.payload.iat, 'Issued time is required');

    const expirationTime = verifiedToken.payload.exp * 1000; // Convert to milliseconds
    const issuedTime = verifiedToken.payload.iat * 1000; // Convert to milliseconds
    const minutesInMS = minutes * 60 * 1000;

    expect(expirationTime - issuedTime).toBe(minutesInMS);
  },
);

test('it deletes the pending transaction data from the pending transaction cache', async () => {
  const transactionID = createPendingTransaction({
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.TWO_FACTOR_AUTH,
    sessionID: null,
  });

  const data = {
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.TWO_FACTOR_AUTH,
    transactionID,
    sessionID: null,
  };

  const ctx = createMockGQLContext({});

  await createTransactionToken(data, ctx);

  const pendingTransaction = pendingTransactionCache.get(transactionID);

  expect(pendingTransaction).toBeUndefined();
});
