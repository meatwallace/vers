import { Context } from '~/types';
import { builder } from '../builder';
import { AuthPayload } from '../types/auth-payload';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { createPayloadResolver } from '../utils/create-payload-resolver';

interface Args {
  input: typeof RefreshAccessTokenInput.$inferInput;
}

export async function refreshAccessToken(
  _: object,
  args: Args,
  ctx: Context,
): Promise<typeof RefreshAccessTokenPayload.$inferType> {
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
    resolveType: createPayloadResolver(AuthPayload),
    types: [AuthPayload, MutationErrorPayload],
  },
);

export const resolve = refreshAccessToken;

builder.mutationField('refreshAccessToken', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: RefreshAccessTokenInput }),
    },
    resolve: refreshAccessToken,
    type: RefreshAccessTokenPayload,
  }),
);
