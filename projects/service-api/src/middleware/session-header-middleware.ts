import type { Context, Next } from 'hono';

export async function sessionHeaderMiddleware(ctx: Context, next: Next) {
  const sessionID = ctx.req.header('x-session-id');

  if (sessionID) {
    ctx.set('sessionID', sessionID);
  }

  await next();
}
