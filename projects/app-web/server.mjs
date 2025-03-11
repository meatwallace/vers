import * as fs from 'node:fs';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { reactRouter } from 'remix-hono/handler';
import sourceMapSupport from 'source-map-support';

sourceMapSupport.install({
  retrieveSourceMap: function (source) {
    // get source file without the `file://` prefix or `?t=...` suffix
    const match = /^file:\/\/(.*)\?t=[.\d]+$/.exec(source);

    if (match) {
      return {
        map: fs.readFileSync(`${match[1]}.map`, 'utf8'),
        url: source,
      };
    }

    return null;
  },
});

Sentry.init({
  beforeSendTransaction(event) {
    // ignore all healthcheck related transactions
    // note that name of header here is case-sensitive
    if (event.request?.headers?.['x-healthcheck'] === 'true') {
      return null;
    }

    return event;
  },
  denyUrls: [
    /\/resources\/healthcheck/,
    /\/build\//,
    /\/favicons\//,
    /\/img\//,
    /\/fonts\//,
    /\/favicon.ico/,
    /\/site\.webmanifest/,
  ],
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [Sentry.httpIntegration(), nodeProfilingIntegration()],
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 1 : 0,
});

const app = new Hono();

app.use(logger());

app.get('/assets/*', serveStatic({ root: './build/client/assets' }));

app.get('/*', serveStatic({ root: './build/client' }));

app.use(
  reactRouter({
    build: await import('./build/server/index.js'),
    mode: process.env.NODE_ENV,
  }),
);

serve(app);

console.log('⚡️ Serving Web App @ http://localhost:3000');
