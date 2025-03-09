import type { Context, MiddlewareHandler, Next } from 'hono';

export const createSessionHeaderMiddleware = (): MiddlewareHandler => {
  return async (ctx: Context, next: Next) => {
    const sessionID = ctx.req.header('x-session-id');

    if (sessionID) {
      ctx.set('sessionID', sessionID);
    }

    await next();
  };
};
