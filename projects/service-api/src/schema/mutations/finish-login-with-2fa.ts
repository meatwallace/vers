import type { Context } from '~/types';
import { logger } from '~/logger';
import { verifyTransactionToken } from '~/utils/verify-transaction-token';
import { builder } from '../builder';
import { UNKNOWN_ERROR } from '../errors';
import { AuthPayload } from '../types/auth-payload';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { VerificationType } from '../types/verification-type';
import { createPayloadResolver } from '../utils/create-payload-resolver';

interface Args {
  input: typeof FinishLoginWith2FAInput.$inferInput;
}

// ensure we use the same error message for all failures to avoid enumeration
const AMBIGUOUS_INVALID_VERIFICATION_ERROR = {
  message: '2FA verification is invalid or has expired',
  title: 'Invalid code',
};

export async function finishLoginWith2FA(
  _: object,
  args: Args,
  ctx: Context,
): Promise<typeof FinishLoginWith2FAPayload.$inferType> {
  try {
    const user = await ctx.services.user.getUser.query({
      email: args.input.target,
    });

    if (!user) {
      return { error: AMBIGUOUS_INVALID_VERIFICATION_ERROR };
    }

    const verification = await ctx.services.verification.getVerification.query({
      target: args.input.target,
      type: '2fa',
    });

    if (!verification) {
      return { error: AMBIGUOUS_INVALID_VERIFICATION_ERROR };
    }

    const payload = await verifyTransactionToken(
      {
        action: VerificationType.TWO_FACTOR_AUTH,
        target: args.input.target,
        token: args.input.transactionToken,
      },
      ctx,
    );

    // our transaction token isn't valid or we don't have a session ID
    if (!payload?.session_id) {
      return { error: AMBIGUOUS_INVALID_VERIFICATION_ERROR };
    }

    const previousSession = await ctx.services.session.getSession.query({
      id: payload.session_id,
    });

    if (!previousSession) {
      return { error: AMBIGUOUS_INVALID_VERIFICATION_ERROR };
    }

    // create a new session now that 2FA is verified, using the expiry of the
    // previous temporary session
    const authPayload = await ctx.services.session.createSession.mutate({
      expiresAt: previousSession.expiresAt,
      ipAddress: ctx.ipAddress,
      userID: user.id,
    });

    // delete the previous session as it's no longer needed
    await ctx.services.session.deleteSession.mutate({
      id: previousSession.id,
      userID: user.id,
    });

    return authPayload;
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      logger.error(error.message);
    }

    return { error: UNKNOWN_ERROR };
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
    resolveType: createPayloadResolver(AuthPayload),
    types: [AuthPayload, MutationErrorPayload],
  },
);

export const resolve = finishLoginWith2FA;

builder.mutationField('finishLoginWith2FA', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: FinishLoginWith2FAInput }),
    },
    directives: {
      rateLimit: {
        duration: 60,
        limit: 10,
      },
    },
    resolve: finishLoginWith2FA,
    type: FinishLoginWith2FAPayload,
  }),
);
