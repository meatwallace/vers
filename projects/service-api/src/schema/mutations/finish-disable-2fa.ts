import { logger } from '~/logger';
import { AuthedContext } from '~/types';
import { verifyTransactionToken } from '~/utils/verify-transaction-token';
import { builder } from '../builder';
import {
  MutationErrorPayload,
  MutationErrorPayloadData,
} from '../types/mutation-error-payload';
import { MutationSuccess } from '../types/mutation-success';
import { VerificationType } from '../types/verification-type';
import { createPayloadResolver } from '../utils/create-payload-resolver';
import { requireAuth } from '../utils/require-auth';

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

interface MutationSuccessResult {
  success: true;
}

interface Args {
  input: typeof FinishDisable2FAInput.$inferInput;
}

export async function finishDisable2FA(
  _: object,
  args: Args,
  ctx: AuthedContext,
): Promise<MutationSuccessResult | MutationErrorPayloadData> {
  try {
    const isValidTransaction = await verifyTransactionToken(
      {
        token: args.input.transactionToken,
        action: VerificationType.TWO_FACTOR_AUTH_DISABLE,
        target: ctx.user.email,
      },
      ctx,
    );

    if (!isValidTransaction) {
      return {
        error: {
          title: 'An unknown error occurred',
          message: 'An unknown error occurred',
        },
      };
    }

    const verification = await ctx.services.verification.getVerification({
      type: '2fa',
      target: ctx.user.email,
    });

    if (!verification) {
      return {
        error: {
          title: '2FA not enabled',
          message: '2FA is not enabled for your account.',
        },
      };
    }

    // Delete the 2FA verification record
    await ctx.services.verification.deleteVerification({
      id: verification.id,
    });

    return { success: true };
  } catch (error) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      logger.error(error.message);
    }

    return {
      error: {
        title: 'An unknown error occurred',
        message: 'An unknown error occurred',
      },
    };
  }
}

const FinishDisable2FAInput = builder.inputType('FinishDisable2FAInput', {
  fields: (t) => ({
    transactionToken: t.string({ required: true }),
  }),
});

const FinishDisable2FAPayload = builder.unionType('FinishDisable2FAPayload', {
  types: [MutationSuccess, MutationErrorPayload],
  resolveType: createPayloadResolver(MutationSuccess),
});

export const resolve = requireAuth(finishDisable2FA);

builder.mutationField('finishDisable2FA', (t) =>
  t.field({
    type: FinishDisable2FAPayload,
    args: {
      input: t.arg({ type: FinishDisable2FAInput, required: true }),
    },
    resolve: resolve,
  }),
);
