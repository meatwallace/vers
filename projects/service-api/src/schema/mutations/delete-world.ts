import { Context, StandardMutationPayload } from '../../types';
import { isAuthed } from '../../utils';
import { MutationErrorPayload } from '../types';
import { createPayloadResolver, createUnauthorizedError } from '../utils';
import { builder } from '../builder';

type Args = {
  input: typeof DeleteWorldInput.$inferInput;
};

export async function deleteWorld(
  _: object,
  args: Args,
  ctx: Context,
): Promise<StandardMutationPayload<{ success: boolean }>> {
  if (!isAuthed(ctx)) {
    return { error: createUnauthorizedError() };
  }

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

const DeleteWorldSuccessPayload = builder.objectRef<{ success: boolean }>(
  'DeleteWorldSuccessPayload',
);

DeleteWorldSuccessPayload.implement({
  fields: (t) => ({
    success: t.exposeBoolean('success'),
  }),
});

const DeleteWorldPayload = builder.unionType('DeleteWorldPayload', {
  types: [DeleteWorldSuccessPayload, MutationErrorPayload],
  resolveType: createPayloadResolver(DeleteWorldSuccessPayload),
});

builder.mutationField('deleteWorld', (t) =>
  t.field({
    type: DeleteWorldPayload,
    args: {
      input: t.arg({ type: DeleteWorldInput, required: true }),
    },
    resolve: deleteWorld,
  }),
);
