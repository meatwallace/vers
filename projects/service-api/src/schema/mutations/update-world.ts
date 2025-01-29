import invariant from 'tiny-invariant';
import { Context, StandardMutationPayload } from '~/types';
import { omitNullish } from '~/utils/omit-nullish';
import { builder } from '../builder';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { World } from '../types/world';
import { createPayloadResolver } from '../utils/create-payload-resolver';
import { requireAuth } from '../utils/require-auth';

type Args = {
  input: typeof UpdateWorldInput.$inferInput;
};

export async function updateWorld(
  _: object,
  args: Args,
  ctx: Context,
): Promise<StandardMutationPayload<typeof World.$inferType>> {
  invariant(ctx.user, 'user is required in an authed resolver');

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

export const resolve = requireAuth(updateWorld);

builder.mutationField('updateWorld', (t) =>
  t.field({
    type: UpdateWorldPayload,
    args: {
      input: t.arg({ type: UpdateWorldInput, required: true }),
    },
    resolve,
  }),
);
