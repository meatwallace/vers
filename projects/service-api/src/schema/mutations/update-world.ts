import { AuthedContext } from '~/types';
import { omitNullish } from '~/utils/omit-nullish';
import { builder } from '../builder';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { World } from '../types/world';
import { createPayloadResolver } from '../utils/create-payload-resolver';
import { requireAuth } from '../utils/require-auth';

interface Args {
  input: typeof UpdateWorldInput.$inferInput;
}

export async function updateWorld(
  _: object,
  args: Args,
  ctx: AuthedContext,
): Promise<typeof UpdateWorldPayload.$inferType> {
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
    archetype: t.string({}),
    atmosphere: t.string({}),
    fantasyType: t.string({}),
    geographyFeatures: t.stringList({}),
    geographyType: t.string({}),
    name: t.string({}),
    population: t.string({}),
    technologyLevel: t.string({}),
    worldID: t.string({ required: true }),
  }),
});

const UpdateWorldPayload = builder.unionType('UpdateWorldPayload', {
  resolveType: createPayloadResolver(World),
  types: [World, MutationErrorPayload],
});

export const resolve = requireAuth(updateWorld);

builder.mutationField('updateWorld', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: UpdateWorldInput }),
    },
    resolve,
    type: UpdateWorldPayload,
  }),
);
