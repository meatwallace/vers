import { Context } from '../../types';
import { isAuthed } from '../../utils';
import { builder } from '../builder';

type Args = {
  input: typeof GenerateWorldNamesInput.$inferInput;
};

export async function generateWorldNames(
  _: object,
  args: Args,
  ctx: Context,
): Promise<Array<string>> {
  if (!isAuthed(ctx)) {
    // TODO(#16): capture via sentry
    throw new Error('Unauthorized');
  }

  // eslint-disable-next-line no-useless-catch
  try {
    const names = await ctx.services.world.generateWorldNames({
      ownerID: ctx.user.id,
      worldID: args.input.worldID,
    });

    return names;
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    throw error;
  }
}

const GenerateWorldNamesInput = builder.inputType('GenerateWorldNamesInput', {
  fields: (t) => ({
    worldID: t.string({ required: true }),
  }),
});

builder.queryField('generateWorldNames', (t) =>
  t.stringList({
    args: {
      input: t.arg({ type: GenerateWorldNamesInput, required: true }),
    },
    resolve: generateWorldNames,
  }),
);
