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
 * @description Starts the process of disabling 2FA
 *
 * @permission authenticated - Requires user to be logged in
 *
 * @example
 * ```gql
 * mutation StartDisable2FA($input: StartDisable2FAInput!) {
 *   startDisable2FA(input: $input) {
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

interface Args {
  input: typeof StartDisable2FAInput.$inferInput;
}

export async function startDisable2FA(
  _: object,
  args: Args,
  ctx: AuthedContext,
): Promise<typeof StartDisable2FAPayload.$inferType> {
  try {
    const verification = await ctx.services.verification.getVerification({
      target: ctx.user.email,
      type: '2fa',
    });

    if (!verification) {
      return {
        error: {
          message: '2FA is not enabled for your account.',
          title: '2FA not enabled',
        },
      };
    }

    const transactionID = createPendingTransaction({
      action: VerificationType.TWO_FACTOR_AUTH_DISABLE,
      ipAddress: ctx.ipAddress,
      sessionID: ctx.session.id,
      target: ctx.user.email,
    });

    return {
      sessionID: null,
      transactionID,
    };
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

const StartDisable2FAInput = builder.inputType('StartDisable2FAInput', {
  fields: (t) => ({
    placeholder: t.string({ required: false }),
  }),
});

const StartDisable2FAPayload = builder.unionType('StartDisable2FAPayload', {
  resolveType: createPayloadResolver(TwoFactorRequiredPayload),
  types: [TwoFactorRequiredPayload, MutationErrorPayload],
});

export const resolve = requireAuth(startDisable2FA);

builder.mutationField('startDisable2FA', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: StartDisable2FAInput }),
    },
    resolve: resolve,
    type: StartDisable2FAPayload,
  }),
);
