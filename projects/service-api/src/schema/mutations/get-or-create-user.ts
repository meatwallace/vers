import { Context, StandardMutationPayload } from '../../types';
import { getTokenFromContext } from '../../utils/get-token-from-context';
import { builder } from '../builder';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { User } from '../types/user';
import { createUnauthorizedError } from '../utils/create-unauthorized-error';
import { createPayloadResolver } from '../utils/create-payload-resolver';

type Args = {
  input: typeof GetOrCreateUserInput.$inferInput;
};

export async function getOrCreateUser(
  _: object,
  args: Args,
  ctx: Context,
): Promise<StandardMutationPayload<typeof User>> {
  const accessToken = getTokenFromContext(ctx);

  if (!accessToken) {
    return { error: createUnauthorizedError() };
  }

  // eslint-disable-next-line no-useless-catch
  try {
    const user = await ctx.services.users.getOrCreateUser({
      email: args.input.email,
    });

    return user;
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    throw error;
  }
}
const GetOrCreateUserInput = builder.inputType('GetOrCreateUserInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
  }),
});

const GetOrCreateUserPayload = builder.unionType('GetOrCreateUserPayload', {
  types: [User, MutationErrorPayload],
  resolveType: createPayloadResolver(User),
});

builder.mutationField('getOrCreateUser', (t) =>
  t.field({
    type: GetOrCreateUserPayload,
    args: {
      input: t.arg({ type: GetOrCreateUserInput, required: true }),
    },
    resolve: getOrCreateUser,
  }),
);
