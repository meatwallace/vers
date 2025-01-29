import invariant from 'tiny-invariant';
import { Context } from '~/types';
import { builder } from '../builder';
import { User } from '../types/user';
import { requireAuth } from '../utils/require-auth';

type Args = Record<PropertyKey, never>;

export async function getCurrentUser(
  _: object,
  args: Args,
  ctx: Context,
): Promise<typeof User.$inferType> {
  invariant(ctx.user, 'user is required in an authed resolver');

  // we can return the user from the context directly as it was fetched when we instantiated our context
  return ctx.user;
}

export const resolve = requireAuth(getCurrentUser);

builder.queryField('getCurrentUser', (t) =>
  t.field({
    type: User,
    resolve,
  }),
);
