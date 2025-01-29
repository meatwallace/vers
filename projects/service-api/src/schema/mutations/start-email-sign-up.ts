import { generateWelcomeEmail } from '@chrono/email-templates';
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

    if (existingUser) {
      return {
        error: {
          title: 'User already exists',
          message: 'A user already exists with this email',
        },
      };
    }

    const verification = await ctx.services.verification.createVerification({
      type: 'onboarding',
      target: args.input.email,
      period: 10 * 60, // 10 minutes
    });

    const onboardingURL = new URL(`${env.APP_WEB_URL}/verify-otp`);

    onboardingURL.searchParams.set('type', VerificationType.ONBOARDING);
    onboardingURL.searchParams.set('target', args.input.email);
    onboardingURL.searchParams.set('code', verification.code);

    const email = await generateWelcomeEmail({
      onboardingURL: onboardingURL.toString(),
      otp: verification.code,
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
