import {
  generateExistingAccountEmail,
  generateWelcomeEmail,
} from '@chrono/email-templates';
import { Context, StandardMutationPayload } from '~/types';
import { env } from '~/env';
import { builder } from '../builder';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { MutationSuccess } from '../types/mutation-success';
import { VerificationType } from '../types/verification-type';
import { createPayloadResolver } from '../utils/create-payload-resolver';

type Args = {
  input: typeof StartEmailSignupInput.$inferInput;
};

export async function startEmailSignup(
  _: object,
  args: Args,
  ctx: Context,
): Promise<StandardMutationPayload<typeof MutationSuccess.$inferType>> {
  // eslint-disable-next-line no-useless-catch
  try {
    const existingUser = await ctx.services.user.getUser({
      email: args.input.email,
    });

    // as our user exists, let's email them to notify them that they've tried
    // to sign up on an email that already exists then return a success response
    // as to avoid user enumeration
    if (existingUser) {
      const email = await generateExistingAccountEmail({
        email: args.input.email,
      });

      await ctx.services.email.sendEmail({
        to: args.input.email,
        subject: 'You already have an account!',
        ...email,
      });

      return { success: true };
    }

    const verification = await ctx.services.verification.createVerification({
      type: 'onboarding',
      target: args.input.email,
      period: 10 * 60, // 10 minutes
    });

    const verificationURL = new URL(`${env.APP_WEB_URL}/verify-otp`);

    verificationURL.searchParams.set('type', VerificationType.ONBOARDING);
    verificationURL.searchParams.set('target', args.input.email);
    verificationURL.searchParams.set('code', verification.code);

    const email = await generateWelcomeEmail({
      verificationURL: verificationURL.toString(),
      verificationCode: verification.code,
    });

    await ctx.services.email.sendEmail({
      to: args.input.email,
      subject: 'Welcome to Chrononomicon!',
      ...email,
    });

    return { success: true };
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    // console.error(error);

    throw error;
  }
}

const StartEmailSignupInput = builder.inputType('StartEmailSignupInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
  }),
});

const StartEmailSignupPayload = builder.unionType('StartEmailSignupPayload', {
  types: [MutationSuccess, MutationErrorPayload],
  resolveType: createPayloadResolver(MutationSuccess),
});

export const resolve = startEmailSignup;

builder.mutationField('startEmailSignup', (t) =>
  t.field({
    type: StartEmailSignupPayload,
    args: {
      input: t.arg({ type: StartEmailSignupInput, required: true }),
    },
    resolve,
  }),
);
