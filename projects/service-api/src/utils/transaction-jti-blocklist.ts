import TTLCache from '@isaacs/ttlcache';

/**
 * 5 minute in memory cache to block JTIs of consumed transaction tokens.
 *
 * {
 *   [jti: string]: true,
 * }
 */
export const transactionJTIBlocklist = new TTLCache<string, true>({
  ttl: 5 * 60 * 1000,
});
