import { afterEach, expect, test } from 'vitest';
import { drop } from '@mswjs/data';
import invariant from 'tiny-invariant';
import { db } from '~/mocks/db';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { pendingTransactionCache } from '~/utils/pending-transaction-cache';
import { VerificationType } from '../types/verification-type';
import { resolve } from './start-disable-2fa';

afterEach(() => {
  drop(db);
});

test('it successfully creates a pending transaction when 2FA is enabled', async () => {
  const user = db.user.create({
    email: 'test@example.com',
  });

  db.verification.create({
    target: user.email,
    type: '2fa',
  });

  const ctx = createMockGQLContext({ user });

  const args = {
    input: {},
  };

  const result = await resolve({}, args, ctx);

  expect(result).toStrictEqual({
    sessionID: null,
    transactionID: expect.any(String),
  });

  invariant('transactionID' in result);

  const pendingTransaction = pendingTransactionCache.get(result.transactionID);

  expect(pendingTransaction).toStrictEqual({
    action: VerificationType.TWO_FACTOR_AUTH_DISABLE,
    attempts: 0,
    ipAddress: ctx.ipAddress,
    sessionID: ctx.session?.id,
    target: user.email,
  });
});

test('it returns an error if 2FA is not enabled', async () => {
  const user = db.user.create({
    email: 'test@example.com',
  });

  const ctx = createMockGQLContext({ user });

  const args = {
    input: {},
  };

  const result = await resolve({}, args, ctx);

  expect(result).toStrictEqual({
    error: {
      message: '2FA is not enabled for your account.',
      title: '2FA not enabled',
    },
  });
});
