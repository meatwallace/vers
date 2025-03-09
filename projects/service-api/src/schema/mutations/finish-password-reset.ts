import { generatePasswordChangedEmail } from '@chrono/email-templates';
import { logger } from '~/logger';
import { type Context } from '~/types';
import { verifyTransactionToken } from '~/utils/verify-transaction-token';
import { builder } from '../builder';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { MutationSuccess } from '../types/mutation-success';
import { VerificationType } from '../types/verification-type';
import { createPayloadResolver } from '../utils/create-payload-resolver';

/**
 * @description Completes a password reset by updating the user's password and sending a confirmation email
 *
 * @example
 * ```gql
 * mutation FinishPasswordReset {
 *   finishPasswordReset(input: {
 *     email: "test@example.com",
 *     password: "newPassword123"
 *   }) {
 *     ... on FinishPasswordResetPayload {
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
  input: typeof FinishPasswordResetInput.$inferInput;
}

// always return successful to avoid enumeration
const AMBIGUOUS_SUCCESS_RESPONSE = {
  success: true,
} as const;

export async function finishPasswordReset(
  _: object,
  args: Args,
  ctx: Context,
): Promise<typeof FinishPasswordResetPayload.$inferType> {
  try {
    const user = await ctx.services.user.getUser({
      email: args.input.email,
    });

    if (!user) {
      return AMBIGUOUS_SUCCESS_RESPONSE;
    }

    const twoFactorVerification =
      await ctx.services.verification.getVerification({
        target: args.input.email,
        type: '2fa',
      });

    const isValidTransaction = await verifyTransactionToken(
      {
        action: VerificationType.RESET_PASSWORD,
        target: args.input.email,
        token: args.input.transactionToken,
      },
      ctx,
    );

    if (twoFactorVerification && !isValidTransaction) {
      return AMBIGUOUS_SUCCESS_RESPONSE;
    }

    await ctx.services.user.changePassword({
      id: user.id,
      password: args.input.password,
      resetToken: args.input.resetToken,
    });

    const email = await generatePasswordChangedEmail({
      email: user.email,
    });

    await ctx.services.email.sendEmail({
      html: email.html,
      plainText: email.plainText,
      subject: 'Password Changed',
      to: user.email,
    });

    return AMBIGUOUS_SUCCESS_RESPONSE;
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      logger.error(error.message);
    }

    return AMBIGUOUS_SUCCESS_RESPONSE;
  }
}

const FinishPasswordResetInput = builder.inputType('FinishPasswordResetInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    password: t.string({ required: true }),
    resetToken: t.string({ required: true }),
    transactionToken: t.string({ required: false }),
  }),
});

const FinishPasswordResetPayload = builder.unionType(
  'FinishPasswordResetPayload',
  {
    resolveType: createPayloadResolver(MutationSuccess),
    types: [MutationSuccess, MutationErrorPayload],
  },
);

export const resolve = finishPasswordReset;

builder.mutationField('finishPasswordReset', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: FinishPasswordResetInput }),
    },
    resolve: finishPasswordReset,
    type: FinishPasswordResetPayload,
  }),
);
