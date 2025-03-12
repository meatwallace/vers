import type { Context } from '~/types';
import { logger } from '~/logger';
import { createPendingTransaction } from '~/utils/create-pending-transaction';
import { builder } from '../builder';
import { INVALID_CREDENTIALS_ERROR, UNKNOWN_ERROR } from '../errors';
import { AuthPayload } from '../types/auth-payload';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { TwoFactorRequiredPayload } from '../types/two-factor-required-payload';
import { VerificationType } from '../types/verification-type';
import { createPayloadResolver } from '../utils/create-payload-resolver';

interface Args {
  input: typeof LoginWithPasswordInput.$inferInput;
}

export async function loginWithPassword(
  _: object,
  args: Args,
  ctx: Context,
): Promise<typeof LoginWithPasswordPayload.$inferType> {
  try {
    const user = await ctx.services.user.getUser.query({
      email: args.input.email,
    });

    if (!user) {
      return {
        error: INVALID_CREDENTIALS_ERROR,
      };
    }

    const verifyPasswordResult = await ctx.services.user.verifyPassword.mutate({
      email: args.input.email,
      password: args.input.password,
    });

    if (!verifyPasswordResult.success) {
      return {
        error: INVALID_CREDENTIALS_ERROR,
      };
    }

    // Check if 2FA is enabled for this user by looking for a verification record
    const verification = await ctx.services.verification.getVerification.query({
      target: user.email,
      type: '2fa',
    });

    // create a session regardless if the user requires 2FA as we need it to
    // bind the transaction to the session
    const authPayload = await ctx.services.session.createSession.mutate({
      ipAddress: ctx.ipAddress,
      rememberMe: args.input.rememberMe,
      userID: user.id,
    });

    // If 2FA is enabled, return the two factor required payload
    if (verification) {
      const transactionID = createPendingTransaction({
        action: VerificationType.TWO_FACTOR_AUTH,
        ipAddress: ctx.ipAddress,
        sessionID: authPayload.session.id,
        target: user.email,
      });

      return { sessionID: authPayload.session.id, transactionID };
    }

    return authPayload;
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(error.message);
    }

    return { error: UNKNOWN_ERROR };
  }
}

const LoginWithPasswordInput = builder.inputType('LoginWithPasswordInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    password: t.string({ required: true }),
    rememberMe: t.boolean({ required: true }),
  }),
});

const LoginWithPasswordPayload = builder.unionType('LoginWithPasswordPayload', {
  resolveType: createPayloadResolver(AuthPayload),
  types: [AuthPayload, TwoFactorRequiredPayload, MutationErrorPayload],
});

export const resolve = loginWithPassword;

builder.mutationField('loginWithPassword', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: LoginWithPasswordInput }),
    },
    directives: {
      rateLimit: {
        duration: 60,
        limit: 10,
      },
    },
    resolve: loginWithPassword,
    type: LoginWithPasswordPayload,
  }),
);
