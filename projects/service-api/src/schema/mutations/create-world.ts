import { Context, StandardMutationPayload } from '../../types';
import { isAuthed } from '../../utils';
import { MutationErrorPayload } from '../types';
import { World } from '../types';
import { createPayloadResolver, createUnauthorizedError } from '../utils';
import { builder } from '../builder';

type Args = {
  input: typeof CreateWorldInput.$inferInput;
};

export async function createWorld(
  _: object,
  args: Args,
  ctx: Context,
): Promise<StandardMutationPayload<typeof World.$inferType>> {
  if (!isAuthed(ctx)) {
    return { error: createUnauthorizedError() };
  }

  // eslint-disable-next-line no-useless-catch
  try {
    const world = await ctx.services.world.createWorld({
      ownerID: ctx.user.id,
    });

    return world;
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    throw error;
  }
}

const CreateWorldInput = builder.inputType('CreateWorldInput', {
  fields: (t) => ({
    placeholder: t.string({ required: false }),
  }),
});

const CreateWorldPayload = builder.unionType('CreateWorldPayload', {
  types: [World, MutationErrorPayload],
  resolveType: createPayloadResolver(World),
});

builder.mutationField('createWorld', (t) =>
  t.field({
    type: CreateWorldPayload,
    args: {
      input: t.arg({ type: CreateWorldInput, required: true }),
    },
    resolve: createWorld,
  }),
);
