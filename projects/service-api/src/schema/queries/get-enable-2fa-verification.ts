import invariant from 'tiny-invariant';
import { GraphQLError } from 'graphql';
import { logger } from '~/logger';
import { Context } from '~/types';
import { builder } from '../builder';
import { requireAuth } from '../utils/require-auth';

/**
 * @description Retrieves the verification URI for 2FA setup
 *
 * @example
 * ```gql
 * query GetEnable2FAVerification {
 *   getEnable2FAVerification {
 *     otpURI
 *   }
 * }
 * ```
 */

interface TwoFactorVerificationData {
  otpURI: string;
}

export async function getEnable2FAVerification(
  _: object,
  __: object,
  ctx: Context,
): Promise<TwoFactorVerificationData> {
  invariant(ctx.user, 'user is required in an authed resolver');

  try {
    const otpURI = await ctx.services.verification.get2FAVerificationURI({
      target: ctx.user.email,
    });

    return { otpURI };
  } catch (error) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      logger.error(error.message);
    }

    throw new GraphQLError('An unknown error occurred', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
      },
    });
  }
}

const TwoFactorVerification = builder.objectRef<TwoFactorVerificationData>(
  'TwoFactorVerification',
);

TwoFactorVerification.implement({
  fields: (t) => ({
    otpURI: t.exposeString('otpURI'),
  }),
});

export const resolve = requireAuth(getEnable2FAVerification);

builder.queryField('getEnable2FAVerification', (t) =>
  t.field({
    type: TwoFactorVerification,
    resolve: resolve,
  }),
);
