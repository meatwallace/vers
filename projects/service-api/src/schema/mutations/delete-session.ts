import invariant from 'tiny-invariant';
import { Context, StandardMutationPayload } from '~/types';
import { builder } from '../builder';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { MutationSuccess } from '../types/mutation-success';
import { createPayloadResolver } from '../utils/create-payload-resolver';
import { requireAuth } from '../utils/require-auth';

type Args = {
  input: typeof DeleteSessionInput.$inferInput;
};

const DeleteSessionInput = builder.inputType('DeleteSessionInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});

const DeleteSessionPayload = builder.unionType('DeleteSessionPayload', {
  types: [MutationSuccess, MutationErrorPayload],
  resolveType: createPayloadResolver(MutationSuccess),
});

export async function deleteSession(
  root: unknown,
  args: Args,
  ctx: Context,
): Promise<StandardMutationPayload<typeof MutationSuccess.$inferType>> {
  invariant(ctx.user, 'user is required in an authed resolver');

  // eslint-disable-next-line no-useless-catch
  try {
    await ctx.services.session.deleteSession({
      id: args.input.id,
      userID: ctx.user.id,
    });

    return { success: true };
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    throw error;
  }
}

export const resolve = requireAuth(deleteSession);

builder.mutationField('deleteSession', (t) =>
  t.field({
    type: DeleteSessionPayload,
    args: {
      input: t.arg({ type: DeleteSessionInput, required: true }),
    },
    resolve,
  }),
);
