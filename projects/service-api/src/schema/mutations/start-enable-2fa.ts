import type { AuthedContext } from '~/types';
import { logger } from '~/logger';
import { createPendingTransaction } from '~/utils/create-pending-transaction';
import { builder } from '../builder';
import { UNKNOWN_ERROR } from '../errors';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { TwoFactorRequiredPayload } from '../types/two-factor-required-payload';
import { VerificationType } from '../types/verification-type';
import { createPayloadResolver } from '../utils/create-payload-resolver';
import { requireAuth } from '../utils/require-auth';

/**
 * @description Initiates the 2FA setup process for a user by creating a verification record
 *
 * @example
 * ```gql
 * mutation StartEnable2FA($input: StartEnable2FAInput!) {
 *   startEnable2FA(input: $input) {
 *     ... on TwoFactorRequiredPayload {
 *       transactionID
 *     }
 *
 *     ... on MutationErrorPayload {
 *       error {
 *         title
 *         message
 *       }
 *     }
 *   }
 * }
 * ```
 */
export async function startEnable2FA(
  _: object,
  __: object,
  ctx: AuthedContext,
): Promise<typeof StartEnable2FAPayload.$inferType> {
  try {
    const is2FAEnabled = await ctx.services.verification.getVerification.query({
      target: ctx.user.email,
      type: '2fa',
    });

    if (is2FAEnabled) {
      return {
        error: {
          message:
            'Two-factor authentication is already enabled for your account.',
          title: 'Two-factor authentication already enabled',
        },
      };
    }

    const existing2FASetupVerification =
      await ctx.services.verification.getVerification.query({
        target: ctx.user.email,
        type: '2fa-setup',
      });

    // If there's an existing 2FA setup verification, delete it
    if (existing2FASetupVerification) {
      await ctx.services.verification.deleteVerification.mutate({
        id: existing2FASetupVerification.id,
      });
    }

    await ctx.services.verification.createVerification.mutate({
      target: ctx.user.email,
      type: '2fa-setup',
    });

    const transactionID = createPendingTransaction({
      action: VerificationType.TWO_FACTOR_AUTH_SETUP,
      ipAddress: ctx.ipAddress,
      sessionID: ctx.session.id,
      target: ctx.user.email,
    });

    return { sessionID: null, transactionID };
  } catch (error) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      logger.error(error.message);
    }

    return { error: UNKNOWN_ERROR };
  }
}

const StartEnable2FAInput = builder.inputType('StartEnable2FAInput', {
  fields: (t) => ({
    placeholder: t.string({ required: false }),
  }),
});

const StartEnable2FAPayload = builder.unionType('StartEnable2FAPayload', {
  resolveType: createPayloadResolver(TwoFactorRequiredPayload),
  types: [TwoFactorRequiredPayload, MutationErrorPayload],
});

export const resolve = requireAuth(startEnable2FA);

builder.mutationField('startEnable2FA', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: StartEnable2FAInput }),
    },
    directives: {
      rateLimit: {
        duration: 60,
        limit: 10,
      },
    },
    resolve: resolve,
    type: StartEnable2FAPayload,
  }),
);
