import { createId } from '@paralleldrive/cuid2';
import { SecureAction } from '~/types';
import { pendingTransactionCache } from './pending-transaction-cache';

interface Data {
  action: SecureAction;
  ipAddress: string;
  sessionID: null | string;
  target: string;
}

/**
 * Creates a pending transaction and stores it in the transaction cache,
 * returning the transaction ID.
 *
 * @returns The pending transaction's ID.
 */
export function createPendingTransaction(data: Data): string {
  const transactionID = createId();

  pendingTransactionCache.set(transactionID, {
    ...data,
    attempts: 0,
  });

  return transactionID;
}
