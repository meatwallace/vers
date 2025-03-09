import type { Context, MiddlewareHandler, Next } from 'hono';
import { HttpBindings } from '@hono/node-server';
import invariant from 'tiny-invariant';

export const createRemoteAddressMiddleware = (): MiddlewareHandler => {
  return async (ctx: Context, next: Next) => {
    const bindings = ctx.env as HttpBindings;

    const ipAddress =
      ctx.req.header('x-forwarded-for') ??
      bindings.incoming.socket.remoteAddress;

    invariant(ipAddress, 'IP address is required');

    ctx.set('ipAddress', ipAddress);

    await next();
  };
};
