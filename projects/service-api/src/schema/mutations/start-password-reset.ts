import { type Context } from '~/types.ts';
import { generateResetPasswordEmail } from '@chrono/email-templates';
import { env } from '~/env.ts';
import { builder } from '../builder.ts';
import { MutationErrorPayload } from '../types/mutation-error-payload.ts';
import { createPayloadResolver } from '../utils/create-payload-resolver.ts';
import { VerificationType } from '../types/verification-type.ts';

/**
 * @description Initiates a password reset for a user by sending a verification email
 *
 * @example
 * ```gql
 * mutation StartPasswordReset {
 *   startPasswordReset(input: { email: "user@example.com" }) {
 *     ... on StartPasswordResetPayload {
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

type Args = {
  input: typeof StartPasswordResetInput.$inferInput;
};

export async function startPasswordReset(_: object, args: Args, ctx: Context) {
  // eslint-disable-next-line no-useless-catch
  try {
    const user = await ctx.services.user.getUser({
      email: args.input.email,
    });

    // return a success response as to avoid user enumeration if the userdoesn't exist
    if (!user) {
      return { success: true };
    }

    const resetToken = await ctx.services.user.createPasswordResetToken({
      id: user.id,
    });

    const verification = await ctx.services.verification.createVerification({
      type: 'reset-password',
      target: args.input.email,
      period: 60 * 10, // 10 minutes
    });

    const verificationURL = new URL(`${env.APP_WEB_URL}/verify-otp`);
    const redirectSearchParams = new URLSearchParams({ token: resetToken });

    const redirectPath = `/reset-password?${redirectSearchParams.toString()}`;

    verificationURL.searchParams.set('type', VerificationType.RESET_PASSWORD);
    verificationURL.searchParams.set('target', args.input.email);
    verificationURL.searchParams.set('code', verification.code);
    verificationURL.searchParams.set('redirect', redirectPath);

    const { html, plainText } = await generateResetPasswordEmail({
      verificationURL: verificationURL.toString(),
      otp: verification.code,
    });

    await ctx.services.email.sendEmail({
      to: args.input.email,
      subject: 'Reset Your Password',
      html,
      plainText,
    });

    return { success: true };
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    throw error;
  }
}

const StartPasswordResetInput = builder.inputType('StartPasswordResetInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
  }),
});

type StartPasswordResetPayloadData = {
  success: boolean;
};

export const StartPasswordResetPayload =
  builder.objectRef<StartPasswordResetPayloadData>('StartPasswordResetPayload');

StartPasswordResetPayload.implement({
  fields: (t) => ({
    success: t.exposeBoolean('success'),
  }),
});

const StartPasswordResetPayloadUnion = builder.unionType(
  'StartPasswordResetPayloadUnion',
  {
    types: [StartPasswordResetPayload, MutationErrorPayload],
    resolveType: createPayloadResolver(StartPasswordResetPayload),
  },
);

export const resolve = startPasswordReset;

builder.mutationField('startPasswordReset', (t) =>
  t.field({
    type: StartPasswordResetPayloadUnion,
    args: {
      input: t.arg({ type: StartPasswordResetInput, required: true }),
    },
    resolve: startPasswordReset,
  }),
);
