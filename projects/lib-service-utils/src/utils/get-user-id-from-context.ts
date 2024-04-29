import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';

export function getUserIDFromContext(ctx: Context): string {
  const tokenPayload = ctx.get('jwtPayload');

  if (!tokenPayload) {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }

  return tokenPayload.sub;
}
