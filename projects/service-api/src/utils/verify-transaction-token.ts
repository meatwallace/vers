import * as jose from 'jose';
import { z } from 'zod';
import { env } from '~/env';
import { logger } from '~/logger';
import { VerificationType } from '~/schema/types/verification-type';
import { Context } from '~/types';
import { transactionJTIBlocklist } from './transaction-jti-blocklist';

const JWTPayloadSchema = z.object({
  action: z.nativeEnum(VerificationType),
  amr: z.array(z.string()),
  auth_time: z.number(),
  ip_address: z.string(),
  jti: z.string(),
  mfa_verified: z.boolean(),
  session_id: z.string().nullable(),
  sub: z.string(),
  transaction_id: z.string(),
});

const SESSION_REQUIRED_ACTIONS = new Set([
  VerificationType.CHANGE_EMAIL,
  VerificationType.CHANGE_PASSWORD,
  VerificationType.TWO_FACTOR_AUTH,
  VerificationType.TWO_FACTOR_AUTH_DISABLE,
]);

interface VerifyTransactionTokenData {
  action: VerificationType;
  target: string;
  token: null | string | undefined;
}

/**
 * Verifies a transaction token and returns true if it is valid.
 *
 * @param data - The data to verify.
 * @param ctx - The context of the request.
 * @returns True if the token is valid or not provided, false otherwise.
 */
export async function verifyTransactionToken(
  data: VerifyTransactionTokenData,
  ctx: Context,
): Promise<null | z.infer<typeof JWTPayloadSchema>> {
  // if no token was provided, return true and let the caller handle the logic
  if (!data.token) {
    return null;
  }

  const publicKey = await jose.importPKCS8(env.JWT_SIGNING_SECRET, 'RS256');

  try {
    const verifiedJWT = await jose.jwtVerify(data.token, publicKey, {
      algorithms: ['RS256'],
      audience: env.API_IDENTIFIER,
      issuer: env.API_IDENTIFIER,
      maxTokenAge: '20 minutes',
      requiredClaims: [
        'amr',
        'mfa_verified',
        'ip_address',
        'auth_time',
        'action',
        'session_id',
        'transaction_id',
        'jti',
      ],
    });

    const payload = JWTPayloadSchema.parse(verifiedJWT.payload);

    const logCtx = { payload };

    if (transactionJTIBlocklist.has(payload.jti)) {
      logger.debug(logCtx, 'Transaction token already used');

      return null;
    }

    // immediately track our JTI as used to prevent replay attacks
    transactionJTIBlocklist.set(payload.jti, true);

    if (payload.sub !== data.target) {
      logger.debug(logCtx, 'Target mismatch while verifying transaction token');

      return null;
    }

    if (payload.action !== data.action) {
      logger.debug(logCtx, 'Action mismatch while verifying transaction token');

      return null;
    }

    if (payload.ip_address !== ctx.ipAddress) {
      logger.debug(
        logCtx,
        'IP address mismatch while verifying transaction token',
      );

      return null;
    }

    const isSessionRequired = SESSION_REQUIRED_ACTIONS.has(payload.action);

    // everything after this point will be session verification
    if (!isSessionRequired) {
      return payload;
    }

    if (!payload.session_id) {
      logger.debug(logCtx, 'Session ID is required for this action');

      return null;
    }

    if (payload.session_id !== ctx.session?.id) {
      logger.debug(
        logCtx,
        'Session ID mismatch while verifying transaction token',
      );

      return null;
    }

    const session = await ctx.services.session.getSession({
      id: payload.session_id,
    });

    if (!session) {
      logger.debug(
        logCtx,
        'Session not found while verifying transaction token',
      );

      return null;
    }

    return payload;
  } catch (error) {
    logger.error(error, 'Error verifying transaction token');

    return null;
  }
}
