import invariant from 'tiny-invariant';
import { Context } from '~/types';
import { builder } from '../builder';
import { World } from '../types/world';
import { requireAuth } from '../utils/require-auth';

type Args = {
  input: typeof GetWorldsInput.$inferInput;
};

export async function getWorlds(
  _: object,
  args: Args,
  ctx: Context,
): Promise<Array<typeof World.$inferType>> {
  invariant(ctx.user, 'user is required in an authed resolver');

  // eslint-disable-next-line no-useless-catch
  try {
    const worlds = await ctx.services.world.getWorlds({
      ownerID: ctx.user.id,
    });

    return worlds;
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    throw error;
  }
}

const GetWorldsInput = builder.inputType('GetWorldsInput', {
  fields: (t) => ({
    placeholder: t.string({ required: false }),
  }),
});

export const resolve = requireAuth(getWorlds);

builder.queryField('getWorlds', (t) =>
  t.field({
    type: [World],
    args: {
      input: t.arg({ type: GetWorldsInput, required: true }),
    },
    resolve,
  }),
);
