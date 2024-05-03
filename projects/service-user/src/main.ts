import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { app } from './app';
import { env } from './env';
import './routes';

app.use(logger());

serve({ fetch: app.fetch, port: env.PORT, hostname: env.HOSTNAME });

console.log(`⚡️ Serving User API @ http://${env.HOSTNAME}:${env.PORT}`);
