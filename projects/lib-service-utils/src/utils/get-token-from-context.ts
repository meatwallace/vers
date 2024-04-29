import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';

export function getTokenFromContext(ctx: Context): string {
  const token = ctx.get('token');

  if (!token) {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }

  return token;
}
