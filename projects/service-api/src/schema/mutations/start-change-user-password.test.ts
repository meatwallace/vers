import { afterEach, expect, test } from 'vitest';
import { drop } from '@mswjs/data';
import invariant from 'tiny-invariant';
import { db } from '~/mocks/db';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { pendingTransactionCache } from '~/utils/pending-transaction-cache';
import { VerificationType } from '../types/verification-type';
import { resolve } from './start-change-user-password';

afterEach(() => {
  drop(db);
});

test('it creates a pending transaction when user has 2FA enabled', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    name: 'Test User',
    username: 'test_user',
  });

  db.verification.create({
    target: user.email,
    type: '2fa',
  });

  const session = db.session.create({
    userID: user.id,
  });

  const ctx = createMockGQLContext({
    session,
    user,
  });

  const result = await resolve({}, { input: {} }, ctx);

  expect(result).toStrictEqual({
    sessionID: null,
    transactionID: expect.any(String),
  });

  invariant('transactionID' in result);

  const pendingTransaction = pendingTransactionCache.get(result.transactionID);

  expect(pendingTransaction).toStrictEqual({
    action: VerificationType.CHANGE_PASSWORD,
    attempts: 0,
    ipAddress: ctx.ipAddress,
    sessionID: ctx.session?.id,
    target: user.email,
  });
});

test('it returns an error when user does not have 2FA enabled', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    name: 'Test User',
    username: 'test_user',
  });

  const session = db.session.create({
    userID: user.id,
  });

  const ctx = createMockGQLContext({ session, user });

  const result = await resolve({}, { input: {} }, ctx);

  expect(result).toStrictEqual({
    error: {
      message: '2FA is not enabled for your account.',
      title: '2FA not enabled',
    },
  });
});
