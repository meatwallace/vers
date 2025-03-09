import { VerificationType } from '~/schema/types/verification-type';
import { createPendingTransaction } from './create-pending-transaction';
import { pendingTransactionCache } from './pending-transaction-cache';

test('it creates a new transaction ID and stores it in the cache', () => {
  const transactionID = createPendingTransaction({
    target: 'test',
    ipAddress: '127.0.0.1',
    action: VerificationType.TWO_FACTOR_AUTH,
    sessionID: null,
  });

  const pendingTransaction = pendingTransactionCache.get(transactionID);

  expect(pendingTransaction).toMatchObject({
    target: 'test',
    ipAddress: '127.0.0.1',
    action: VerificationType.TWO_FACTOR_AUTH,
    sessionID: null,
    attempts: 0,
  });
});
