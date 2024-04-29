import { Context } from '../../types';
import { isAuthed } from '../../utils';
import { builder } from '../builder';
import { User } from '../types';

builder.queryField('getCurrentUser', (t) =>
  t.field({
    type: User,
    resolve: getCurrentUser,
  }),
);

type Args = {
  name?: string | null;
};

export async function getCurrentUser(
  _: object,
  args: Args,
  ctx: Context,
): Promise<typeof User.$inferType> {
  if (!isAuthed(ctx)) {
    // TODO(#16): capture via sentry
    throw new Error('Unauthorized');
  }

  // eslint-disable-next-line no-useless-catch
  try {
    const user = await ctx.services.users.getCurrentUser({});

    return user;
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    throw error;
  }
}
