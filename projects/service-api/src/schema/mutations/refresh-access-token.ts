import { Context } from '~/types';
import { builder } from '../builder';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { AuthPayload } from '../types/auth-payload';
import { createPayloadResolver } from '../utils/create-payload-resolver';

type Args = {
  input: typeof RefreshAccessTokenInput.$inferInput;
};

export async function refreshAccessToken(_: object, args: Args, ctx: Context) {
  // eslint-disable-next-line no-useless-catch
  try {
    const payload = await ctx.services.session.refreshTokens({
      refreshToken: args.input.refreshToken,
    });

    return payload;
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    throw error;
  }
}

const RefreshAccessTokenInput = builder.inputType('RefreshAccessTokenInput', {
  fields: (t) => ({
    refreshToken: t.string({ required: true }),
  }),
});

const RefreshAccessTokenPayload = builder.unionType(
  'RefreshAccessTokenPayload',
  {
    types: [AuthPayload, MutationErrorPayload],
    resolveType: createPayloadResolver(AuthPayload),
  },
);

export const resolve = refreshAccessToken;

builder.mutationField('refreshAccessToken', (t) =>
  t.field({
    type: RefreshAccessTokenPayload,
    args: {
      input: t.arg({ type: RefreshAccessTokenInput, required: true }),
    },
    resolve: refreshAccessToken,
  }),
);
