import { GraphQLError } from 'graphql';
import { logger } from '~/logger';
import { AuthedContext } from '~/types';
import { verifyTransactionToken } from '~/utils/verify-transaction-token';
import { builder } from '../builder';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { MutationSuccess } from '../types/mutation-success';
import { VerificationType } from '../types/verification-type';
import { createPayloadResolver } from '../utils/create-payload-resolver';
import { requireAuth } from '../utils/require-auth';

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

interface Args {
  input: typeof FinishEnable2FAInput.$inferInput;
}

// ensure we use the same error message for all failures to avoid enumeration
const AMBIGUOUS_FAILED_VERIFICATION_ERROR = {
  title: 'Failed Verification',
  message: 'Verification for this operation is invalid or has expired.',
};

export async function finishEnable2FA(
  _: object,
  args: Args,
  ctx: AuthedContext,
): Promise<typeof FinishEnable2FAPayload.$inferType> {
  try {
    const isValidTransactionToken = await verifyTransactionToken(
      {
        token: args.input.transactionToken,
        action: VerificationType.TWO_FACTOR_AUTH_SETUP,
        target: ctx.user.email,
      },
      ctx,
    );

    if (!isValidTransactionToken) {
      return {
        error: AMBIGUOUS_FAILED_VERIFICATION_ERROR,
      };
    }

    const twoFactorVerification =
      await ctx.services.verification.getVerification({
        type: '2fa-setup',
        target: ctx.user.email,
      });

    if (!twoFactorVerification) {
      return {
        error: AMBIGUOUS_FAILED_VERIFICATION_ERROR,
      };
    }

    await ctx.services.verification.updateVerification({
      id: twoFactorVerification.id,
      type: '2fa',
    });

    return { success: true };
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

const FinishEnable2FAInput = builder.inputType('FinishEnable2FAInput', {
  fields: (t) => ({
    transactionToken: t.string({ required: true }),
  }),
});

const FinishEnable2FAPayload = builder.unionType('FinishEnable2FAPayload', {
  types: [MutationSuccess, MutationErrorPayload],
  resolveType: createPayloadResolver(MutationSuccess),
});

export const resolve = requireAuth(finishEnable2FA);

builder.mutationField('finishEnable2FA', (t) =>
  t.field({
    type: FinishEnable2FAPayload,
    args: {
      input: t.arg({ type: FinishEnable2FAInput, required: true }),
    },
    resolve: resolve,
  }),
);
