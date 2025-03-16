import type { AuthedContext } from '~/types';
import { logger } from '~/logger';
import { createPendingTransaction } from '~/utils/create-pending-transaction';
import { builder } from '../builder';
import { TWO_FACTOR_NOT_ENABLED_ERROR, UNKNOWN_ERROR } from '../errors';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { TwoFactorRequiredPayload } from '../types/two-factor-required-payload';
import { VerificationType } from '../types/verification-type';
import { createPayloadResolver } from '../utils/create-payload-resolver';
import { requireAuth } from '../utils/require-auth';

interface Args {
  input: typeof StartChangeUserPasswordInput.$inferInput;
}

/**
 * @description Initiates the password change process for a user with 2FA enabled.
 * Creates a pending transaction for 2FA verification and returns the transaction ID.
 *
 * @example
 * ```gql
 * mutation StartChangeUserPassword($input: StartChangeUserPasswordInput!) {
 *   startChangeUserPassword(input: $input) {
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
export async function startChangeUserPassword(
  _: object,
  args: Args,
  ctx: AuthedContext,
): Promise<typeof StartChangeUserPasswordPayload.$inferType> {
  try {
    // Check if user has 2FA enabled
    const is2FAEnabled = await ctx.services.verification.getVerification.query({
      target: ctx.user.email,
      type: '2fa',
    });

    if (!is2FAEnabled) {
      return {
        error: TWO_FACTOR_NOT_ENABLED_ERROR,
      };
    }

    // Create transaction for 2FA verification
    const transactionID = createPendingTransaction({
      action: VerificationType.CHANGE_PASSWORD,
      ipAddress: ctx.ipAddress,
      sessionID: ctx.session.id,
      target: ctx.user.email,
    });

    return { sessionID: null, transactionID };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }

    return { error: UNKNOWN_ERROR };
  }
}

const StartChangeUserPasswordInput = builder.inputType(
  'StartChangeUserPasswordInput',
  {
    fields: (t) => ({
      placeholder: t.string({ required: false }),
    }),
  },
);

const StartChangeUserPasswordPayload = builder.unionType(
  'StartChangeUserPasswordPayload',
  {
    resolveType: createPayloadResolver(TwoFactorRequiredPayload),
    types: [TwoFactorRequiredPayload, MutationErrorPayload],
  },
);

export const resolve = requireAuth(startChangeUserPassword);

builder.mutationField('startChangeUserPassword', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: StartChangeUserPasswordInput }),
    },
    directives: {
      rateLimit: {
        duration: 60,
        limit: 10,
      },
    },
    resolve: resolve,
    type: StartChangeUserPasswordPayload,
  }),
);
