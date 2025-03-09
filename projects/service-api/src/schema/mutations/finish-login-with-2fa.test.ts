import invariant from 'tiny-invariant';
import { db } from '~/mocks/db';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { createPendingTransaction } from '~/utils/create-pending-transaction';
import { createTransactionToken } from '~/utils/create-transaction-token';
import { drop } from '@mswjs/data';
import { VerificationType } from '../types/verification-type';
import { resolve } from './finish-login-with-2fa';

afterEach(() => {
  drop(db);
});

test('it returns an auth payload when the transaction token is valid', async () => {
  const user = db.user.create({
    email: 'user@test.com',
  });

  const session = db.session.create({
    userID: user.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });

  const ctx = createMockGQLContext({ session });

  const transactionID = createPendingTransaction({
    target: 'user@test.com',
    ipAddress: ctx.ipAddress,
    action: VerificationType.TWO_FACTOR_AUTH,
    sessionID: session.id,
  });

  const verification = db.verification.create({
    type: '2fa',
    target: 'user@test.com',
  });

  const transactionToken = await createTransactionToken(
    {
      target: verification.target,
      action: VerificationType.TWO_FACTOR_AUTH,
      ipAddress: ctx.ipAddress,
      transactionID,
      sessionID: session.id,
    },
    ctx,
  );

  const args = {
    input: {
      target: verification.target,
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
      userID: user.id,
      ipAddress: ctx.ipAddress,
      expiresAt: expect.any(Date),
    },
  });

  invariant('session' in result, 'result should be successful');

  // verify we've got a new session with the same expiry as the previous one
  expect(result.session.id).not.toBe(session.id);
  expect(result.session.expiresAt).toStrictEqual(session.expiresAt);
});

test('it returns an error when 2FA is not enabled', async () => {
  const ctx = createMockGQLContext({});

  const user = db.user.create({
    email: 'user@test.com',
  });

  const session = db.session.create({
    userID: user.id,
    ipAddress: ctx.ipAddress,
  });

  const transactionID = createPendingTransaction({
    target: 'user@test.com',
    ipAddress: ctx.ipAddress,
    action: VerificationType.TWO_FACTOR_AUTH,
    sessionID: session.id,
  });

  const transactionToken = await createTransactionToken(
    {
      target: 'user@test.com',
      action: VerificationType.TWO_FACTOR_AUTH,
      ipAddress: ctx.ipAddress,
      transactionID,
      sessionID: session.id,
    },
    ctx,
  );

  const args = {
    input: {
      target: 'user@test.com',
      transactionToken,
      rememberMe: true,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    error: {
      title: 'Invalid code',
      message: '2FA verification is invalid or has expired',
    },
  });
});

test('it returns an error when the transaction token is invalid', async () => {
  const user = db.user.create({
    email: 'user@test.com',
  });

  db.verification.create({
    type: '2fa',
    target: user.email,
  });

  const ctx = createMockGQLContext({});
  const args = {
    input: {
      target: user.email,
      transactionToken: 'invalid',
      rememberMe: true,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    error: {
      title: 'Invalid code',
      message: '2FA verification is invalid or has expired',
    },
  });
});
