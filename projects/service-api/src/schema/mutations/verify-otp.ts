import { Context, StandardMutationPayload } from '~/types';
import { builder } from '../builder';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { Verification } from '../types/verification';
import { VerificationType } from '../types/verification-type';
import { createPayloadResolver } from '../utils/create-payload-resolver';
import { resolveVerificationType } from '../utils/resolve-verification-type';

type Args = {
  input: typeof VerifyOTPInput.$inferInput;
};

export async function verifyOTP(
  _: object,
  args: Args,
  ctx: Context,
): Promise<StandardMutationPayload<typeof Verification.$inferType>> {
  try {
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

    return verification;
  } catch (error: unknown) {
    console.log('error', error);

    // TODO(#16): capture via Sentry
    throw error;
  }
}

const VerifyOTPInput = builder.inputType('VerifyOTPInput', {
  fields: (t) => ({
    code: t.string({ required: true }),
    type: t.field({ type: VerificationType, required: true }),
    target: t.string({ required: true }),
  }),
});

const VerifyOTPPayload = builder.unionType('VerifyOTPPayload', {
  types: [Verification, MutationErrorPayload],
  resolveType: createPayloadResolver(Verification),
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
