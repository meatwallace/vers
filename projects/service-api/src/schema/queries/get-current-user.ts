import { Context } from '../../types';
import { isAuthed } from '../../utils';
import { builder } from '../builder';
import { User } from '../types';

type Args = Record<PropertyKey, never>;

export async function getCurrentUser(
  _: object,
  args: Args,
  ctx: Context,
): Promise<typeof User.$inferType> {
  if (!isAuthed(ctx)) {
    // TODO(#16): capture via sentry
    throw new Error('Unauthorized');
  }

  // we can return the user from the context directly as it was fetched when we instantiated our context
  return ctx.user;
}

builder.queryField('getCurrentUser', (t) =>
  t.field({
    type: User,
    resolve: getCurrentUser,
  }),
);
