import invariant from 'tiny-invariant';
import { WorldData } from '~/services/world-service/types';
import { Context } from '~/types';
import { builder } from '../builder';
import { World } from '../types/world';
import { requireAuth } from '../utils/require-auth';

interface Args {
  input: typeof GetWorldInput.$inferInput;
}

export async function getWorld(
  _: object,
  args: Args,
  ctx: Context,
): Promise<WorldData> {
  invariant(ctx.user, 'user is required in an authed resolver');

  // eslint-disable-next-line no-useless-catch
  try {
    const world = await ctx.services.world.getWorld({
      ownerID: ctx.user.id,
      worldID: args.input.worldID,
    });

    if (!world) {
      throw new Error('World not found');
    }

    return world;
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    throw error;
  }
}

const GetWorldInput = builder.inputType('GetWorldInput', {
  fields: (t) => ({
    worldID: t.string({ required: true }),
  }),
});

export const resolve = requireAuth(getWorld);

builder.queryField('getWorld', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: GetWorldInput }),
    },
    resolve,
    type: World,
  }),
);
