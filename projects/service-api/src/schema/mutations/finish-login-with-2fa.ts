import { GraphQLError } from 'graphql';
import { logger } from '~/logger';
import { Context } from '~/types';
import { verifyTransactionToken } from '~/utils/verify-transaction-token';
import { builder } from '../builder';
import { AuthPayload } from '../types/auth-payload';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { VerificationType } from '../types/verification-type';
import { createPayloadResolver } from '../utils/create-payload-resolver';

interface Args {
  input: typeof FinishLoginWith2FAInput.$inferInput;
}

// ensure we use the same error message for all failures to avoid enumeration
const AMBIGUOUS_INVALID_VERIFICATION_ERROR = {
  title: 'Invalid code',
  message: '2FA verification is invalid or has expired',
};

export async function finishLoginWith2FA(
  _: object,
  args: Args,
  ctx: Context,
): Promise<typeof FinishLoginWith2FAPayload.$inferType> {
  try {
    const user = await ctx.services.user.getUser({
      email: args.input.target,
    });

    if (!user) {
      return { error: AMBIGUOUS_INVALID_VERIFICATION_ERROR };
    }

    const verification = await ctx.services.verification.getVerification({
      type: '2fa',
      target: args.input.target,
    });

    if (!verification) {
      return { error: AMBIGUOUS_INVALID_VERIFICATION_ERROR };
    }

    const payload = await verifyTransactionToken(
      {
        token: args.input.transactionToken,
        action: VerificationType.TWO_FACTOR_AUTH,
        target: args.input.target,
      },
      ctx,
    );

    // our transaction token isn't valid or we don't have a session ID
    if (!payload?.session_id) {
      return { error: AMBIGUOUS_INVALID_VERIFICATION_ERROR };
    }

    const previousSession = await ctx.services.session.getSession({
      id: payload.session_id,
    });

    if (!previousSession) {
      return { error: AMBIGUOUS_INVALID_VERIFICATION_ERROR };
    }

    // create a new session now that 2FA is verified, using the expiry of the
    // previous temporary session
    const authPayload = await ctx.services.session.createSession({
      userID: user.id,
      ipAddress: ctx.ipAddress,
      expiresAt: previousSession.expiresAt,
    });

    // delete the previous session as it's no longer needed
    await ctx.services.session.deleteSession({
      id: previousSession.id,
      userID: user.id,
    });

    return authPayload;
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

const FinishLoginWith2FAInput = builder.inputType('FinishLoginWith2FAInput', {
  fields: (t) => ({
    target: t.string({ required: true }),
    transactionToken: t.string({ required: true }),
  }),
});

const FinishLoginWith2FAPayload = builder.unionType(
  'FinishLoginWith2FAPayload',
  {
    types: [AuthPayload, MutationErrorPayload],
    resolveType: createPayloadResolver(AuthPayload),
  },
);

export const resolve = finishLoginWith2FA;

builder.mutationField('finishLoginWith2FA', (t) =>
  t.field({
    type: FinishLoginWith2FAPayload,
    args: {
      input: t.arg({ type: FinishLoginWith2FAInput, required: true }),
    },
    resolve: finishLoginWith2FA,
  }),
);
