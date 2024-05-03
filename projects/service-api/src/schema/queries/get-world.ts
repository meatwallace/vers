import { Context } from '../../types';
import { isAuthed } from '../../utils';
import { builder } from '../builder';
import { World } from '../types';

type Args = {
  input: typeof GetWorldInput.$inferInput;
};

export async function getWorld(
  _: object,
  args: Args,
  ctx: Context,
): Promise<typeof World.$inferType> {
  if (!isAuthed(ctx)) {
    // TODO(#16): capture via sentry
    throw new Error('Unauthorized');
  }

  // eslint-disable-next-line no-useless-catch
  try {
    const world = await ctx.services.world.getWorld({
      ownerID: ctx.user.id,
      worldID: args.input.worldID,
    });

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

builder.queryField('getWorld', (t) =>
  t.field({
    type: World,
    args: {
      input: t.arg({ type: GetWorldInput, required: true }),
    },
    resolve: getWorld,
  }),
);
