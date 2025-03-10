import { logger } from '~/logger';
import { AuthedContext } from '~/types';
import { verifyTransactionToken } from '~/utils/verify-transaction-token';
import { builder } from '../builder';
import { UNKNOWN_ERROR } from '../errors';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { MutationSuccess } from '../types/mutation-success';
import { VerificationType } from '../types/verification-type';
import { createPayloadResolver } from '../utils/create-payload-resolver';
import { requireAuth } from '../utils/require-auth';

interface Args {
  input: typeof FinishEnable2FAInput.$inferInput;
}

// ensure we use the same error message for all failures to avoid enumeration
const AMBIGUOUS_FAILED_VERIFICATION_ERROR = {
  message: 'Verification for this operation is invalid or has expired.',
  title: 'Failed Verification',
};

/**
 * @description Completes the 2FA setup process by verifying the transaction token and updating the verification record
 *
 * @example
 * ```gql
 * mutation FinishEnable2FA($input: FinishEnable2FAInput!) {
 *   finishEnable2FA(input: $input) {
 *     ... on MutationSuccess {
 *       success
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
export async function finishEnable2FA(
  _: object,
  args: Args,
  ctx: AuthedContext,
): Promise<typeof FinishEnable2FAPayload.$inferType> {
  try {
    const isValidTransactionToken = await verifyTransactionToken(
      {
        action: VerificationType.TWO_FACTOR_AUTH_SETUP,
        target: ctx.user.email,
        token: args.input.transactionToken,
      },
      ctx,
    );

    if (!isValidTransactionToken) {
      return {
        error: AMBIGUOUS_FAILED_VERIFICATION_ERROR,
      };
    }

    const twoFactorVerification =
      await ctx.services.verification.getVerification.query({
        target: ctx.user.email,
        type: '2fa-setup',
      });

    if (!twoFactorVerification) {
      return {
        error: AMBIGUOUS_FAILED_VERIFICATION_ERROR,
      };
    }

    await ctx.services.verification.updateVerification.mutate({
      id: twoFactorVerification.id,
      type: '2fa',
    });

    return { success: true };
  } catch (error) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      logger.error(error.message);
    }

    return { error: UNKNOWN_ERROR };
  }
}

const FinishEnable2FAInput = builder.inputType('FinishEnable2FAInput', {
  fields: (t) => ({
    transactionToken: t.string({ required: true }),
  }),
});

const FinishEnable2FAPayload = builder.unionType('FinishEnable2FAPayload', {
  resolveType: createPayloadResolver(MutationSuccess),
  types: [MutationSuccess, MutationErrorPayload],
});

export const resolve = requireAuth(finishEnable2FA);

builder.mutationField('finishEnable2FA', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: FinishEnable2FAInput }),
    },
    directives: {
      rateLimit: {
        duration: 60,
        limit: 10,
      },
    },
    resolve: resolve,
    type: FinishEnable2FAPayload,
  }),
);
