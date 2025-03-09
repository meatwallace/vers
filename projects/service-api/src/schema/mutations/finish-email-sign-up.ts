import { logger } from '~/logger';
import { Context } from '~/types';
import { verifyTransactionToken } from '~/utils/verify-transaction-token';
import { builder } from '../builder';
import { AuthPayload } from '../types/auth-payload';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { VerificationType } from '../types/verification-type';
import { createPayloadResolver } from '../utils/create-payload-resolver';

interface Args {
  input: typeof FinishEmailSignupInput.$inferInput;
}

const AMBIGUOUS_UNKNOWN_ERROR = {
  title: 'An unknown error occurred',
  message: 'An unknown error occurred',
};

const AMBIGUOUS_FAILED_VERIFICATION_ERROR = {
  title: 'Failed Verification',
  message: 'Verification for this operation is invalid or has expired.',
};

export async function finishEmailSignup(
  _: object,
  args: Args,
  ctx: Context,
): Promise<typeof FinishEmailSignupPayload.$inferType> {
  try {
    const isValidTransaction = await verifyTransactionToken(
      {
        token: args.input.transactionToken,
        action: VerificationType.ONBOARDING,
        target: args.input.email,
      },
      ctx,
    );

    if (!isValidTransaction) {
      return { error: AMBIGUOUS_FAILED_VERIFICATION_ERROR };
    }

    const existingUser = await ctx.services.user.getUser({
      email: args.input.email,
    });

    if (existingUser) {
      return { error: AMBIGUOUS_UNKNOWN_ERROR };
    }

    const user = await ctx.services.user.createUser({
      email: args.input.email,
      name: args.input.name,
      username: args.input.username,
      password: args.input.password,
    });

    const authPayload = await ctx.services.session.createSession({
      userID: user.id,
      ipAddress: ctx.ipAddress,
      rememberMe: args.input.rememberMe,
    });

    const tokens = await ctx.services.session.refreshTokens({
      refreshToken: authPayload.refreshToken,
    });

    return tokens;
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      logger.error(error.message);
    }

    return { error: AMBIGUOUS_UNKNOWN_ERROR };
  }
}

const FinishEmailSignupInput = builder.inputType('FinishEmailSignupInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    name: t.string({ required: true }),
    username: t.string({ required: true }),
    password: t.string({ required: true }),
    rememberMe: t.boolean({ required: true }),
    transactionToken: t.string({ required: true }),
  }),
});

const FinishEmailSignupPayload = builder.unionType('FinishEmailSignupPayload', {
  types: [AuthPayload, MutationErrorPayload],
  resolveType: createPayloadResolver(AuthPayload),
});

export const resolve = finishEmailSignup;

builder.mutationField('finishEmailSignup', (t) =>
  t.field({
    type: FinishEmailSignupPayload,
    args: {
      input: t.arg({ type: FinishEmailSignupInput, required: true }),
    },
    resolve: finishEmailSignup,
  }),
);
