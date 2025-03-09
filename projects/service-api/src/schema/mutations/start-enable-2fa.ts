import { GraphQLError } from 'graphql';
import { logger } from '~/logger';
import { AuthedContext } from '~/types';
import { createPendingTransaction } from '~/utils/create-pending-transaction';
import { builder } from '../builder';
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
    const is2FAEnabled = await ctx.services.verification.getVerification({
      type: '2fa',
      target: ctx.user.email,
    });

    if (is2FAEnabled) {
      return {
        error: {
          title: 'Two-factor authentication already enabled',
          message:
            'Two-factor authentication is already enabled for your account.',
        },
      };
    }

    const existing2FASetupVerification =
      await ctx.services.verification.getVerification({
        type: '2fa-setup',
        target: ctx.user.email,
      });

    // If there's an existing 2FA setup verification, delete it
    if (existing2FASetupVerification) {
      await ctx.services.verification.deleteVerification({
        id: existing2FASetupVerification.id,
      });
    }

    await ctx.services.verification.createVerification({
      type: '2fa-setup',
      target: ctx.user.email,
    });

    const transactionID = createPendingTransaction({
      target: ctx.user.email,
      action: VerificationType.TWO_FACTOR_AUTH_SETUP,
      ipAddress: ctx.ipAddress,
      sessionID: ctx.session.id,
    });

    return { transactionID, sessionID: null };
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

const StartEnable2FAInput = builder.inputType('StartEnable2FAInput', {
  fields: (t) => ({
    placeholder: t.string({ required: false }),
  }),
});

const StartEnable2FAPayload = builder.unionType('StartEnable2FAPayload', {
  types: [TwoFactorRequiredPayload, MutationErrorPayload],
  resolveType: createPayloadResolver(TwoFactorRequiredPayload),
});

export const resolve = requireAuth(startEnable2FA);

builder.mutationField('startEnable2FA', (t) =>
  t.field({
    type: StartEnable2FAPayload,
    args: {
      input: t.arg({ type: StartEnable2FAInput, required: true }),
    },
    resolve: resolve,
  }),
);
