import type { Context, Next } from 'hono';
import { HttpBindings } from '@hono/node-server';
import invariant from 'tiny-invariant';

interface Env {
  Bindings: {
    server: HttpBindings;
  };
  Variables: {
    ipAddress: string;
  };
}

export async function remoteAddressMiddleware(ctx: Context<Env>, next: Next) {
  const ipAddress =
    ctx.req.header('fly-client-ip') ??
    ctx.req.header('x-forwarded-for')?.split(',')[0] ??
    ctx.env.server.incoming.socket.remoteAddress;

  invariant(ipAddress, 'IP address is required');

  ctx.set('ipAddress', ipAddress);

  await next();
}
