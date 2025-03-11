import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { reactRouter } from 'remix-hono/handler';

const app = new Hono();

app.use(logger());

app.get('/assets/*', serveStatic({ root: './build/client/assets' }));

app.get('/*', serveStatic({ root: './build/client' }));

app.use(
  /* eslint-disable unicorn/no-abusive-eslint-disable */
  /* eslint-disable */
  reactRouter({
    build: await import('./build/server/index.js'),
    mode: process.env.NODE_ENV,
  }),
  /* eslint-enable */
);

serve(app);

console.log('⚡️ Serving Web App @ http://localhost:3000');
