import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { app } from './app';
import { initYoga } from './init-yoga';
import { env } from './env';

app.use(logger());

initYoga();

serve({ fetch: app.fetch, port: env.PORT, hostname: env.HOSTNAME });

console.log(`⚡️ Serving GraphQL API @ http://${env.HOSTNAME}:${env.PORT}`);
