import { Context, StandardMutationPayload } from '~/types';
import { builder } from '../builder';
import { AuthPayload } from '../types/auth-payload';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { createPayloadResolver } from '../utils/create-payload-resolver';

type Args = {
  input: typeof FinishEmailSignupInput.$inferInput;
};

export async function finishEmailSignup(
  _: object,
  args: Args,
  ctx: Context,
): Promise<StandardMutationPayload<typeof AuthPayload.$inferType>> {
  // eslint-disable-next-line no-useless-catch
  try {
    const existingUser = await ctx.services.user.getUser({
      email: args.input.email,
    });

    if (existingUser) {
      // TODO: extract to shared error object/i18n
      return {
        error: {
          title: 'User already exists',
          message: 'A user already exists with this email',
        },
      };
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
    throw error;
  }
}

const FinishEmailSignupInput = builder.inputType('FinishEmailSignupInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    name: t.string({ required: true }),
    username: t.string({ required: true }),
    password: t.string({ required: true }),
    rememberMe: t.boolean({ required: true }),
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
