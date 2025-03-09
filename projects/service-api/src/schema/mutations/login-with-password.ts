import { GraphQLError } from 'graphql';
import { logger } from '~/logger';
import { Context } from '~/types';
import { createPendingTransaction } from '~/utils/create-pending-transaction';
import { builder } from '../builder';
import { AuthPayload } from '../types/auth-payload';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { TwoFactorRequiredPayload } from '../types/two-factor-required-payload';
import { VerificationType } from '../types/verification-type';
import { createPayloadResolver } from '../utils/create-payload-resolver';

interface Args {
  input: typeof LoginWithPasswordInput.$inferInput;
}

// ensure we use the same error message for all failures to avoid enumeration
const AMBIGUOUS_CREDENTIALS_ERROR = {
  title: 'Invalid credentials',
  message: 'Wrong email or password',
};

export async function loginWithPassword(
  _: object,
  args: Args,
  ctx: Context,
): Promise<typeof LoginWithPasswordPayload.$inferType> {
  try {
    const user = await ctx.services.user.getUser({
      email: args.input.email,
    });

    if (!user) {
      return {
        error: AMBIGUOUS_CREDENTIALS_ERROR,
      };
    }

    const verifyPasswordResult = await ctx.services.user.verifyPassword({
      email: args.input.email,
      password: args.input.password,
    });

    if (!verifyPasswordResult.success) {
      return {
        error: AMBIGUOUS_CREDENTIALS_ERROR,
      };
    }

    // Check if 2FA is enabled for this user by looking for a verification record
    const verification = await ctx.services.verification.getVerification({
      type: '2fa',
      target: user.email,
    });

    // create a session regardless if the user requires 2FA as we need it to
    // bind the transaction to the session
    const authPayload = await ctx.services.session.createSession({
      userID: user.id,
      ipAddress: ctx.ipAddress,
      rememberMe: args.input.rememberMe,
    });

    // If 2FA is enabled, return the two factor required payload
    if (verification) {
      const transactionID = createPendingTransaction({
        target: user.email,
        ipAddress: ctx.ipAddress,
        action: VerificationType.TWO_FACTOR_AUTH,
        sessionID: authPayload.session.id,
      });

      return { transactionID, sessionID: authPayload.session.id };
    }

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

const LoginWithPasswordInput = builder.inputType('LoginWithPasswordInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    password: t.string({ required: true }),
    rememberMe: t.boolean({ required: true }),
  }),
});

const LoginWithPasswordPayload = builder.unionType('LoginWithPasswordPayload', {
  types: [AuthPayload, TwoFactorRequiredPayload, MutationErrorPayload],
  resolveType: createPayloadResolver(AuthPayload),
});

export const resolve = loginWithPassword;

builder.mutationField('loginWithPassword', (t) =>
  t.field({
    type: LoginWithPasswordPayload,
    args: {
      input: t.arg({ type: LoginWithPasswordInput, required: true }),
    },
    resolve: loginWithPassword,
  }),
);
