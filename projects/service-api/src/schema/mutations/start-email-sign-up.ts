import { GraphQLError } from 'graphql';
import {
  generateExistingAccountEmail,
  generateWelcomeEmail,
} from '@chrono/email-templates';
import { env } from '~/env';
import { logger } from '~/logger';
import { Context } from '~/types';
import { createPendingTransaction } from '~/utils/create-pending-transaction';
import { builder } from '../builder';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { TwoFactorRequiredPayload } from '../types/two-factor-required-payload';
import { VerificationType } from '../types/verification-type';
import { createPayloadResolver } from '../utils/create-payload-resolver';

interface Args {
  input: typeof StartEmailSignupInput.$inferInput;
}

export async function startEmailSignup(
  _: object,
  args: Args,
  ctx: Context,
): Promise<typeof StartEmailSignupPayload.$inferType> {
  try {
    const transactionID = createPendingTransaction({
      target: args.input.email,
      ipAddress: ctx.ipAddress,
      action: VerificationType.ONBOARDING,
      sessionID: null,
    });

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

      return {
        transactionID,
        sessionID: null,
      };
    }

    const verification = await ctx.services.verification.createVerification({
      type: 'onboarding',
      target: args.input.email,
      period: 10 * 60, // 10 minutes
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    });

    const verificationURL = new URL(`${env.APP_WEB_URL}/verify-otp`);

    verificationURL.searchParams.set('type', VerificationType.ONBOARDING);
    verificationURL.searchParams.set('target', args.input.email);
    verificationURL.searchParams.set('code', verification.code);
    verificationURL.searchParams.set('transactionID', transactionID);

    const email = await generateWelcomeEmail({
      verificationURL: verificationURL.toString(),
      verificationCode: verification.code,
    });

    await ctx.services.email.sendEmail({
      to: args.input.email,
      subject: 'Welcome to Chrononomicon!',
      ...email,
    });

    return {
      transactionID,
      sessionID: null,
    };
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

const StartEmailSignupInput = builder.inputType('StartEmailSignupInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
  }),
});

const StartEmailSignupPayload = builder.unionType('StartEmailSignupPayload', {
  types: [TwoFactorRequiredPayload, MutationErrorPayload],
  resolveType: createPayloadResolver(TwoFactorRequiredPayload),
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
