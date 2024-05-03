import { Context } from '../../types';
import { isAuthed } from '../../utils';
import { builder } from '../builder';
import { World } from '../types';

type Args = {
  input: typeof GetWorldsInput.$inferInput;
};

export async function getWorlds(
  _: object,
  args: Args,
  ctx: Context,
): Promise<Array<typeof World.$inferType>> {
  if (!isAuthed(ctx)) {
    // TODO(#16): capture via sentry
    throw new Error('Unauthorized');
  }

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

builder.queryField('getWorlds', (t) =>
  t.field({
    type: [World],
    args: {
      input: t.arg({ type: GetWorldsInput, required: true }),
    },
    resolve: getWorlds,
  }),
);
