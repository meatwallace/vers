import { afterEach, expect, test } from 'vitest';
import { drop } from '@mswjs/data';
import * as jose from 'jose';
import invariant from 'tiny-invariant';
import { db } from '~/mocks/db';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { SecureAction } from '~/types';
import { env } from '../env';
import { createPendingTransaction } from './create-pending-transaction';
import { createTransactionToken } from './create-transaction-token';
import { pendingTransactionCache } from './pending-transaction-cache';

afterEach(() => {
  drop(db);
});

test('it creates a valid transaction token with required data', async () => {
  const transactionID = createPendingTransaction({
    action: SecureAction.TwoFactorAuth,
    ipAddress: '127.0.0.1',
    sessionID: null,
    target: 'user_123',
  });

  const data = {
    action: SecureAction.TwoFactorAuth,
    ipAddress: '127.0.0.1',
    sessionID: null,
    target: 'user_123',
    transactionID,
  };

  const ctx = createMockGQLContext({});

  const token = await createTransactionToken(data, ctx);
  const key = await jose.importSPKI(env.JWT_SIGNING_PUBKEY, 'RS256');

  const verifiedToken = await jose.jwtVerify(token, key, {
    algorithms: ['RS256'],
    audience: env.API_IDENTIFIER,
    issuer: env.API_IDENTIFIER,
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

  expect(verifiedToken.payload).toStrictEqual({
    action: data.action,
    amr: ['otp'],
    aud: env.API_IDENTIFIER,
    auth_time: expect.any(Number),
    exp: expect.any(Number),
    iat: expect.any(Number),
    ip_address: data.ipAddress,
    iss: env.API_IDENTIFIER,
    jti: expect.any(String),
    mfa_verified: true,
    session_id: null,
    sub: data.target,
    transaction_id: data.transactionID,
  });
});

test('it creates a valid transaction token with session data', async () => {
  const session = db.session.create({
    ipAddress: '127.0.0.1',
    userID: 'user_123',
  });

  const transactionID = createPendingTransaction({
    action: SecureAction.TwoFactorAuth,
    ipAddress: '127.0.0.1',
    sessionID: session.id,
    target: 'user_123',
  });

  const data = {
    action: SecureAction.TwoFactorAuth,
    ipAddress: '127.0.0.1',
    sessionID: session.id,
    target: 'user_123',
    transactionID,
  };

  const ctx = createMockGQLContext({});
  const token = await createTransactionToken(data, ctx);
  const key = await jose.importSPKI(env.JWT_SIGNING_PUBKEY, 'RS256');

  const verifiedToken = await jose.jwtVerify(token, key, {
    algorithms: ['RS256'],
    audience: env.API_IDENTIFIER,
    issuer: env.API_IDENTIFIER,
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

  expect(verifiedToken.payload).toStrictEqual({
    action: data.action,
    amr: ['otp'],
    aud: env.API_IDENTIFIER,
    auth_time: expect.any(Number),
    exp: expect.any(Number),
    iat: expect.any(Number),
    ip_address: data.ipAddress,
    iss: env.API_IDENTIFIER,
    jti: expect.any(String),
    mfa_verified: true,
    session_id: session.id,
    sub: data.target,
    transaction_id: data.transactionID,
  });
});

test('it throws an error when a pending transaction is not found', async () => {
  const data = {
    action: SecureAction.TwoFactorAuth,
    ipAddress: '127.0.0.1',
    sessionID: null,
    target: 'user_123',
    transactionID: 'invalid',
  };

  const ctx = createMockGQLContext({});

  await expect(() => createTransactionToken(data, ctx)).rejects.toThrow(
    'Pending transaction not found',
  );
});

test('it throws an error when session is not found', async () => {
  const transactionID = createPendingTransaction({
    action: SecureAction.TwoFactorAuth,
    ipAddress: '127.0.0.1',
    sessionID: null,
    target: 'user_123',
  });

  const data = {
    action: SecureAction.TwoFactorAuth,
    ipAddress: '127.0.0.1',
    sessionID: 'non_existent_session',
    target: 'user_123',
    transactionID,
  };

  const ctx = createMockGQLContext({});

  await expect(() => createTransactionToken(data, ctx)).rejects.toThrow(
    'Session ID mismatch while creating transaction token',
  );
});

test.each([
  [SecureAction.TwoFactorAuth, 2],
  [SecureAction.TwoFactorAuthSetup, 2],
  [SecureAction.TwoFactorAuthDisable, 2],
  [SecureAction.Onboarding, 20],
  [SecureAction.ChangeEmailConfirmation, 20],
  [SecureAction.ResetPassword, 5],
  [SecureAction.ChangeEmail, 5],
  [SecureAction.ChangePassword, 5],
  [SecureAction.ForceLogout, 2],
])(
  'it generates a %s transaction that expires after %d minutes',
  async (action, minutes) => {
    const transactionID = createPendingTransaction({
      action,
      ipAddress: '127.0.0.1',
      sessionID: null,
      target: 'user_123',
    });

    const data = {
      action,
      ipAddress: '127.0.0.1',
      sessionID: null,
      target: 'user_123',
      transactionID,
    };

    const ctx = createMockGQLContext({});
    const token = await createTransactionToken(data, ctx);
    const key = await jose.importSPKI(env.JWT_SIGNING_PUBKEY, 'RS256');

    const verifiedToken = await jose.jwtVerify(token, key, {
      algorithms: ['RS256'],
      audience: env.API_IDENTIFIER,
      issuer: env.API_IDENTIFIER,
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
    action: SecureAction.TwoFactorAuth,
    ipAddress: '127.0.0.1',
    sessionID: null,
    target: 'user_123',
  });

  const data = {
    action: SecureAction.TwoFactorAuth,
    ipAddress: '127.0.0.1',
    sessionID: null,
    target: 'user_123',
    transactionID,
  };

  const ctx = createMockGQLContext({});

  await createTransactionToken(data, ctx);

  const pendingTransaction = pendingTransactionCache.get(transactionID);

  expect(pendingTransaction).toBeUndefined();
});
