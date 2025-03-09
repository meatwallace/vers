import { AuthedContext } from '~/types';
import { builder } from '../builder';
import { requireAuth } from '../utils/require-auth';

interface Args {
  input: typeof GenerateWorldNamesInput.$inferInput;
}

export async function generateWorldNames(
  _: object,
  args: Args,
  ctx: AuthedContext,
): Promise<Array<string>> {
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

export const resolve = requireAuth(generateWorldNames);

builder.queryField('generateWorldNames', (t) =>
  t.stringList({
    args: {
      input: t.arg({ required: true, type: GenerateWorldNamesInput }),
    },
    resolve,
  }),
);
