import { Context, StandardMutationPayload } from '../../types';
import { isAuthed, omitNullish } from '../../utils';
import { MutationErrorPayload } from '../types';
import { World } from '../types';
import { createPayloadResolver, createUnauthorizedError } from '../utils';
import { builder } from '../builder';

type Args = {
  input: typeof UpdateWorldInput.$inferInput;
};

export async function updateWorld(
  _: object,
  args: Args,
  ctx: Context,
): Promise<StandardMutationPayload<typeof World.$inferType>> {
  if (!isAuthed(ctx)) {
    return { error: createUnauthorizedError() };
  }

  // eslint-disable-next-line no-useless-catch
  try {
    const { worldID, ...update } = omitNullish(args.input);

    const world = await ctx.services.world.updateWorld({
      ownerID: ctx.user.id,
      worldID,
      ...update,
    });

    return world;
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    throw error;
  }
}

const UpdateWorldInput = builder.inputType('UpdateWorldInput', {
  fields: (t) => ({
    worldID: t.string({ required: true }),
    name: t.string({}),
    fantasyType: t.string({}),
    technologyLevel: t.string({}),
    archetype: t.string({}),
    atmosphere: t.string({}),
    population: t.string({}),
    geographyType: t.string({}),
    geographyFeatures: t.stringList({}),
  }),
});

const UpdateWorldPayload = builder.unionType('UpdateWorldPayload', {
  types: [World, MutationErrorPayload],
  resolveType: createPayloadResolver(World),
});

builder.mutationField('updateWorld', (t) =>
  t.field({
    type: UpdateWorldPayload,
    args: {
      input: t.arg({ type: UpdateWorldInput, required: true }),
    },
    resolve: updateWorld,
  }),
);
