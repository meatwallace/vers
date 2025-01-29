import { Context } from '~/types';

type Resolver<TParent, TArgs, TReturn> = (
  parent: TParent,
  args: TArgs,
  ctx: Context,
) => Promise<TReturn>;

export function requireAuth<TParent, TArgs, TReturn>(
  resolver: Resolver<TParent, TArgs, TReturn>,
): Resolver<TParent, TArgs, TReturn> {
  return async (parent, args, ctx) => {
    if (!ctx.user) {
      throw new Error('Unauthorized');
    }

    return resolver(parent, args, ctx);
  };
}
