import { createHonoServer } from 'react-router-hono-server/node';
import { remoteAddressMiddleware } from '@vers/service-utils';
import { compress } from 'hono/compress';
import { poweredBy } from 'hono/powered-by';
import { Hono } from 'hono/quick';
import { env } from './env.ts';
import { logger as appLogger } from './logger.ts';
import { enforceHTTPS } from './middleware/enforce-https.ts';
import { logger } from './middleware/logger.ts';
import { rateLimit } from './middleware/rate-limit.ts';
import { removeTrailingSlash } from './middleware/remove-trailing-slash.ts';
import { setCSPNonce } from './middleware/set-csp-nonce.ts';
import { setSecureHeaders } from './middleware/set-secure-headers.ts';

if (env.isProduction && env.SENTRY_DSN) {
  // eslint-disable-next-line unicorn/prefer-top-level-await
  void import('./utils/init-sentry.ts').then(({ initSentry }) => initSentry());
}

const app = new Hono();

export default await createHonoServer({
  app,
  configure: (server) => {
    server.use('*', logger);
    server.use('*', removeTrailingSlash);
    server.use('*', enforceHTTPS);
    server.use('*', remoteAddressMiddleware);
    server.use('*', setCSPNonce);
    server.use('*', setSecureHeaders);
    server.use('*', rateLimit);
    server.use('*', poweredBy({ serverName: 'vers-idle' }));

    // if we made it past our static asset serving and reached out, bail out
    server.on('GET', ['/favicons/*', '/img/*'], (c) => {
      return c.text('Not found', 404);
    });

    server.use(compress());

    server.onError((error, ctx) => {
      appLogger.error(error);

      return ctx.text('Internal Server Error', 500);
    });
  },
  defaultLogger: false,
  getLoadContext: (ctx, { build }) => ({
    cspNonce: ctx.get('cspNonce'),
    serverBuild: build,
  }),
});
