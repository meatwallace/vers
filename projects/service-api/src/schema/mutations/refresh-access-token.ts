import type { Context } from '~/types';
import { logger } from '~/logger';
import { builder } from '../builder';
import { UNKNOWN_ERROR } from '../errors';
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
  try {
    const payload = await ctx.services.session.refreshTokens.mutate({
      refreshToken: args.input.refreshToken,
    });

    return payload;
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      logger.error(error.message);
    }

    return { error: UNKNOWN_ERROR };
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
    directives: {
      rateLimit: {
        duration: 60,
        limit: 10,
      },
    },
    resolve: refreshAccessToken,
    type: RefreshAccessTokenPayload,
  }),
);
