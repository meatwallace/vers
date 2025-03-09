import { AuthedContext } from '~/types';
import { builder } from '../builder';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { MutationSuccess } from '../types/mutation-success';
import { createPayloadResolver } from '../utils/create-payload-resolver';
import { requireAuth } from '../utils/require-auth';

interface Args {
  input: typeof DeleteWorldInput.$inferInput;
}

export async function deleteWorld(
  _: object,
  args: Args,
  ctx: AuthedContext,
): Promise<typeof DeleteWorldPayload.$inferType> {
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
  resolveType: createPayloadResolver(MutationSuccess),
  types: [MutationSuccess, MutationErrorPayload],
});

export const resolve = requireAuth(deleteWorld);

builder.mutationField('deleteWorld', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: DeleteWorldInput }),
    },
    resolve,
    type: DeleteWorldPayload,
  }),
);
