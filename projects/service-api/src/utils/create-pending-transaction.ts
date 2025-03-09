import { VerificationType } from '~/schema/types/verification-type';
import { createId } from '@paralleldrive/cuid2';
import { pendingTransactionCache } from './pending-transaction-cache';

interface Data {
  target: string;
  ipAddress: string;
  action: VerificationType;
  sessionID: string | null;
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
