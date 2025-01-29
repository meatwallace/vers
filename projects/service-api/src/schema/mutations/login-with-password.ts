import { GraphQLError } from 'graphql';
import { logger } from '~/logger';
import { Context, StandardMutationPayload } from '~/types';
import { builder } from '../builder';
import { AuthPayload } from '../types/auth-payload';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { createPayloadResolver } from '../utils/create-payload-resolver';

type Args = {
  input: typeof LoginWithPasswordInput.$inferInput;
};

export async function loginWithPassword(
  _: object,
  args: Args,
  ctx: Context,
): Promise<StandardMutationPayload<typeof AuthPayload.$inferType>> {
  // eslint-disable-next-line no-useless-catch
  try {
    const user = await ctx.services.user.getUser({
      email: args.input.email,
    });

    if (!user) {
      return {
        error: {
          title: 'Invalid credentials',
          message: 'No user with that email',
        },
      };
    }

    const verifyPasswordResult = await ctx.services.user.verifyPassword({
      email: args.input.email,
      password: args.input.password,
    });

    if (!verifyPasswordResult.success) {
      return {
        error: {
          title: 'Invalid credentials',
          message: verifyPasswordResult.error,
        },
      };
    }

    const authPayload = await ctx.services.session.createSession({
      userID: user.id,
      ipAddress: ctx.ipAddress,
      rememberMe: args.input.rememberMe,
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

const LoginWithPasswordInput = builder.inputType('LoginWithPasswordInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    password: t.string({ required: true }),
    rememberMe: t.boolean({ required: true }),
  }),
});

const LoginWithPasswordPayload = builder.unionType('LoginWithPasswordPayload', {
  types: [AuthPayload, MutationErrorPayload],
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
