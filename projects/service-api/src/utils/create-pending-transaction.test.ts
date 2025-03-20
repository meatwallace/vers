import { expect, test } from 'vitest';
import { SecureAction } from '~/types';
import { createPendingTransaction } from './create-pending-transaction';
import { pendingTransactionCache } from './pending-transaction-cache';

test('it creates a new transaction ID and stores it in the cache', () => {
  const transactionID = createPendingTransaction({
    action: SecureAction.TwoFactorAuth,
    ipAddress: '127.0.0.1',
    sessionID: null,
    target: 'test',
  });

  const pendingTransaction = pendingTransactionCache.get(transactionID);

  expect(pendingTransaction).toStrictEqual({
    action: SecureAction.TwoFactorAuth,
    attempts: 0,
    ipAddress: '127.0.0.1',
    sessionID: null,
    target: 'test',
  });
});
