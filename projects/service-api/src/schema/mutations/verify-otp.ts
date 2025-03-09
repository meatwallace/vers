import { GraphQLError } from 'graphql';
import { logger } from '~/logger';
import { Context } from '~/types';
import { createTransactionToken } from '~/utils/create-transaction-token';
import { trackTransactionAttempt } from '~/utils/track-transaction-attempt';
import { builder } from '../builder';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { TwoFactorSuccessPayload } from '../types/two-factor-success-payload';
import { VerificationType } from '../types/verification-type';
import { createPayloadResolver } from '../utils/create-payload-resolver';
import { resolveVerificationType } from '../utils/resolve-verification-type';

interface Args {
  input: typeof VerifyOTPInput.$inferInput;
}

export async function verifyOTP(
  _: object,
  args: Args,
  ctx: Context,
): Promise<typeof VerifyOTPPayload.$inferType> {
  try {
    trackTransactionAttempt(args.input.transactionID);

    const verification = await ctx.services.verification.verifyCode({
      code: args.input.code,
      type: resolveVerificationType(args.input.type),
      target: args.input.target,
    });

    if (!verification) {
      return {
        error: { title: 'Invalid OTP', message: 'Invalid verification code' },
      };
    }

    const transactionToken = await createTransactionToken(
      {
        target: verification.target,
        action: args.input.type,
        ipAddress: ctx.ipAddress,
        transactionID: args.input.transactionID,
        sessionID: args.input.sessionID ?? null,
      },
      ctx,
    );

    return { transactionToken };
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

const VerifyOTPInput = builder.inputType('VerifyOTPInput', {
  fields: (t) => ({
    code: t.string({ required: true }),
    type: t.field({ type: VerificationType, required: true }),
    target: t.string({ required: true }),
    transactionID: t.string({ required: true }),
    sessionID: t.string({ required: false }),
  }),
});

const VerifyOTPPayload = builder.unionType('VerifyOTPPayload', {
  types: [TwoFactorSuccessPayload, MutationErrorPayload],
  resolveType: createPayloadResolver(TwoFactorSuccessPayload),
});

export const resolve = verifyOTP;

builder.mutationField('verifyOTP', (t) =>
  t.field({
    type: VerifyOTPPayload,
    args: {
      input: t.arg({ type: VerifyOTPInput, required: true }),
    },
    resolve: verifyOTP,
  }),
);
