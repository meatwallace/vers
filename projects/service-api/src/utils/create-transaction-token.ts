import { createId } from '@paralleldrive/cuid2';
import * as jose from 'jose';
import type { Context } from '~/types';
import { SecureAction } from '~/types';
import { env } from '../env';
import { pendingTransactionCache } from './pending-transaction-cache';

interface Data {
  action: SecureAction;
  ipAddress: string;
  sessionID: null | string;
  target: string;
  transactionID: string;
}

/**
 * Creates a short lived, single use transaction token that is
 * used to bind authorization to a specific secure action.
 *
 * @param data - The data to create the token with.
 * @param ctx - The context of the request.
 * @returns The transaction token.
 */
export async function createTransactionToken(
  data: Data,
  ctx: Context,
): Promise<string> {
  const pendingTransaction = pendingTransactionCache.get(data.transactionID);

  if (!pendingTransaction) {
    throw new Error('Pending transaction not found');
  }

  if (pendingTransaction.target !== data.target) {
    throw new Error('Target mismatch while creating transaction token');
  }

  if (pendingTransaction.ipAddress !== data.ipAddress) {
    throw new Error('IP address mismatch while creating transaction token');
  }

  if (pendingTransaction.action !== data.action) {
    throw new Error('Action mismatch while creating transaction token');
  }

  if (pendingTransaction.sessionID !== data.sessionID) {
    throw new Error('Session ID mismatch while creating transaction token');
  }

  if (data.sessionID) {
    const session = await ctx.services.session.getSession.query({
      id: data.sessionID,
    });

    if (!session) {
      throw new Error('Session not found while creating transaction token');
    }
  }

  const payload = {
    action: data.action,
    amr: ['otp'],
    auth_time: Math.floor(Date.now() / 1000),
    ip_address: data.ipAddress,
    mfa_verified: true,
    session_id: data.sessionID,
    sub: data.target,
    transaction_id: data.transactionID,
  };

  const jti = createId();

  const privateKey = await jose.importPKCS8(env.JWT_SIGNING_PRIVKEY, 'RS256');

  const expirationTime = SECURE_ACTION_EXPIRATION_TIME[data.action];

  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt()
    .setIssuer(env.API_IDENTIFIER)
    .setAudience(env.API_IDENTIFIER)
    .setExpirationTime(expirationTime)
    .setJti(jti)
    .sign(privateKey);

  // we can safely remove our pending transaction now that we've created a token
  pendingTransactionCache.delete(data.transactionID);

  return jwt;
}

/**
 * The expiration time for each secure action.
 *
 * Duration is decided by evaluating expected between time between token
 * generation -> action completion & security requirements.
 */
const SECURE_ACTION_EXPIRATION_TIME: Record<SecureAction, string> = {
  // low risk operations i.e. email verification
  [SecureAction.ChangeEmailConfirmation]: '20 minutes',
  [SecureAction.Onboarding]: '20 minutes',

  // med risk operations i.e. password resets/changes
  [SecureAction.ChangeEmail]: '5 minutes',
  [SecureAction.ChangePassword]: '5 minutes',
  [SecureAction.ResetPassword]: '5 minutes',

  // high risk operations / operations that are expected to be completed immediately
  // i.e. 2FA login & initial setup
  [SecureAction.ForceLogout]: '2 minute',
  [SecureAction.TwoFactorAuth]: '2 minutes',
  [SecureAction.TwoFactorAuthDisable]: '2 minutes',
  [SecureAction.TwoFactorAuthSetup]: '2 minutes',
};
