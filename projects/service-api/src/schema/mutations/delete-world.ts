import invariant from 'tiny-invariant';
import { Context, StandardMutationPayload } from '~/types';
import { builder } from '../builder';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { MutationSuccess } from '../types/mutation-success';
import { createPayloadResolver } from '../utils/create-payload-resolver';
import { requireAuth } from '../utils/require-auth';

type Args = {
  input: typeof DeleteWorldInput.$inferInput;
};

export async function deleteWorld(
  _: object,
  args: Args,
  ctx: Context,
): Promise<StandardMutationPayload<typeof MutationSuccess.$inferType>> {
  invariant(ctx.user, 'user is required in an authed resolver');

  // eslint-disable-next-line no-useless-catch
  try {
    await ctx.services.world.deleteWorld({
      ownerID: ctx.user.id,
      worldID: args.input.worldID,
    });

    return { success: true };
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    throw error;
  }
}

const DeleteWorldInput = builder.inputType('DeleteWorldInput', {
  fields: (t) => ({
    worldID: t.string({ required: true }),
  }),
});

const DeleteWorldPayload = builder.unionType('DeleteWorldPayload', {
  types: [MutationSuccess, MutationErrorPayload],
  resolveType: createPayloadResolver(MutationSuccess),
});

export const resolve = requireAuth(deleteWorld);

builder.mutationField('deleteWorld', (t) =>
  t.field({
    type: DeleteWorldPayload,
    args: {
      input: t.arg({ type: DeleteWorldInput, required: true }),
    },
    resolve,
  }),
);
