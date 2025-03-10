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
  input: typeof FinishDisable2FAInput.$inferInput;
}

/**
 * @description Finishes the process of disabling 2FA after verifying the provided
 * transaction token.
 *
 * @permission authenticated - Requires user to be logged in
 *
 * @example
 * ```gql
 * mutation FinishDisable2FA($input: FinishDisable2FAInput!) {
 *   finishDisable2FA(input: $input) {
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
export async function finishDisable2FA(
  _: object,
  args: Args,
  ctx: AuthedContext,
): Promise<typeof FinishDisable2FAPayload.$inferType> {
  try {
    const isValidTransaction = await verifyTransactionToken(
      {
        action: VerificationType.TWO_FACTOR_AUTH_DISABLE,
        target: ctx.user.email,
        token: args.input.transactionToken,
      },
      ctx,
    );

    if (!isValidTransaction) {
      return { error: UNKNOWN_ERROR };
    }

    const verification = await ctx.services.verification.getVerification.query({
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

    // Delete the 2FA verification record
    await ctx.services.verification.deleteVerification.mutate({
      id: verification.id,
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

const FinishDisable2FAInput = builder.inputType('FinishDisable2FAInput', {
  fields: (t) => ({
    transactionToken: t.string({ required: true }),
  }),
});

const FinishDisable2FAPayload = builder.unionType('FinishDisable2FAPayload', {
  resolveType: createPayloadResolver(MutationSuccess),
  types: [MutationSuccess, MutationErrorPayload],
});

export const resolve = requireAuth(finishDisable2FA);

builder.mutationField('finishDisable2FA', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: FinishDisable2FAInput }),
    },
    directives: {
      rateLimit: {
        duration: 60,
        limit: 10,
      },
    },
    resolve: resolve,
    type: FinishDisable2FAPayload,
  }),
);
