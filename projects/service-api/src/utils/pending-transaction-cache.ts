import TTLCache from '@isaacs/ttlcache';
import { VerificationType } from '~/schema/types/verification-type';

interface TransactionData {
  target: string;
  ipAddress: string;
  action: VerificationType;
  sessionID: string | null;
  attempts: number;
}

/**
 * 5 minute in memory cache to allowlist transaction IDs. This:
 *
 * * binds transaction IDs to their assosciated data to prevent cross-transaction attacks
 * * prevents reply attacks by tracking the verification attempts for a specific transaction ID
 *
 * The cache is of the format:
 *
 * {
 *   [transactionID]: TransactionData,
 * }
 */
export const pendingTransactionCache = new TTLCache<string, TransactionData>({
  ttl: 5 * 60 * 1000,
});
