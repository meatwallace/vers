import { generateResetPasswordEmail } from '@chrono/email-templates';
import { GraphQLError } from 'graphql';
import { env } from '~/env.ts';
import { logger } from '~/logger.ts';
import { Context } from '~/types.ts';
import { createPendingTransaction } from '~/utils/create-pending-transaction.ts';
import { builder } from '../builder.ts';
import { MutationErrorPayload } from '../types/mutation-error-payload.ts';
import { MutationSuccess } from '../types/mutation-success.ts';
import { TwoFactorRequiredPayload } from '../types/two-factor-required-payload.ts';
import { VerificationType } from '../types/verification-type.ts';
import { createPayloadResolver } from '../utils/create-payload-resolver.ts';

/**
 * @description Initiates a password reset for a user by sending a verification email
 *
 * @example
 * ```gql
 * mutation StartPasswordReset {
 *   startPasswordReset(input: { email: "user@example.com" }) {
 *     ... on MutationSuccess {
 *       success
 *     }
 *
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
  input: typeof StartPasswordResetInput.$inferInput;
}

export async function startPasswordReset(
  _: object,
  args: Args,
  ctx: Context,
): Promise<typeof StartPasswordResetPayload.$inferType> {
  try {
    const user = await ctx.services.user.getUser({
      email: args.input.email,
    });

    // return a success response as to avoid user enumeration if the user doesn't exist
    if (!user) {
      return { success: true };
    }

    const resetToken = await ctx.services.user.createPasswordResetToken({
      id: user.id,
    });

    const twoFactorVerification =
      await ctx.services.verification.getVerification({
        target: args.input.email,
        type: '2fa',
      });

    let resetURL: URL;

    // if we have 2FA enabled the user needs to verify a OTP prior to resetting their password
    if (twoFactorVerification) {
      const resetURLSearchParams = new URLSearchParams({
        email: args.input.email,
        token: resetToken,
      });

      const redirectPath = `/reset-password?${resetURLSearchParams.toString()}`;

      resetURL = new URL(`${env.APP_WEB_URL}/verify-otp`);

      const transactionID = createPendingTransaction({
        action: VerificationType.RESET_PASSWORD,
        ipAddress: ctx.ipAddress,
        sessionID: null,
        target: args.input.email,
      });

      resetURL.searchParams.set('type', VerificationType.RESET_PASSWORD);
      resetURL.searchParams.set('target', args.input.email);
      resetURL.searchParams.set('redirect', redirectPath);
      resetURL.searchParams.set('transactionID', transactionID);
    } else {
      // if we don't have 2FA enabled the user can reset their password directly
      resetURL = new URL(`${env.APP_WEB_URL}/reset-password`);

      resetURL.searchParams.set('token', resetToken);
      resetURL.searchParams.set('email', args.input.email);
    }

    const { html, plainText } = await generateResetPasswordEmail({
      resetURL: resetURL.toString(),
    });

    await ctx.services.email.sendEmail({
      html,
      plainText,
      subject: 'Reset Your Password',
      to: args.input.email,
    });

    const transactionID = createPendingTransaction({
      action: VerificationType.RESET_PASSWORD,
      ipAddress: ctx.ipAddress,
      sessionID: null,
      target: args.input.email,
    });

    if (twoFactorVerification) {
      return { sessionID: null, transactionID };
    }

    return { success: true };
  } catch (error: unknown) {
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

const StartPasswordResetInput = builder.inputType('StartPasswordResetInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
  }),
});

const StartPasswordResetPayload = builder.unionType(
  'StartPasswordResetPayload',
  {
    resolveType: createPayloadResolver(MutationSuccess),
    types: [MutationSuccess, TwoFactorRequiredPayload, MutationErrorPayload],
  },
);

export const resolve = startPasswordReset;

builder.mutationField('startPasswordReset', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: StartPasswordResetInput }),
    },
    resolve: startPasswordReset,
    type: StartPasswordResetPayload,
  }),
);
