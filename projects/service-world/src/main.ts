import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { app } from './app';
import { env } from './env';
import './routes';

app.use(logger());

serve({ fetch: app.fetch, hostname: env.HOSTNAME, port: env.PORT });

console.log(`⚡️ Serving Worlds API @ http://${env.HOSTNAME}:${env.PORT}`);
