import invariant from 'tiny-invariant';
import { drop } from '@mswjs/data';
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
    id: 'verification-id',
    type: '2fa',
    target: user.email,
    secret: 'ABCDEFGHIJKLMNOP',
    algorithm: 'SHA-1',
    digits: 6,
    period: 30,
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
  });

  const ctx = createMockGQLContext({ user });

  const args = {
    input: {},
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    transactionID: expect.any(String),
    sessionID: null,
  });

  invariant('transactionID' in result);

  const pendingTransaction = pendingTransactionCache.get(result.transactionID);

  expect(pendingTransaction).toMatchObject({
    target: user.email,
    action: VerificationType.TWO_FACTOR_AUTH_DISABLE,
    ipAddress: ctx.ipAddress,
    sessionID: ctx.session?.id,
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

  expect(result).toMatchObject({
    error: {
      title: '2FA not enabled',
      message: '2FA is not enabled for your account.',
    },
  });
});
