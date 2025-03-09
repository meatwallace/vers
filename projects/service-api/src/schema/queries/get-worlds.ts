import { AuthedContext } from '~/types';
import { builder } from '../builder';
import { World } from '../types/world';
import { requireAuth } from '../utils/require-auth';

interface Args {
  input: typeof GetWorldsInput.$inferInput;
}

export async function getWorlds(
  _: object,
  args: Args,
  ctx: AuthedContext,
): Promise<Array<typeof World.$inferType>> {
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
    args: {
      input: t.arg({ required: true, type: GetWorldsInput }),
    },
    resolve,
    type: [World],
  }),
);
