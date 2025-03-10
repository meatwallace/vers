import { serve } from '@hono/node-server';
import { trpcServer } from '@hono/trpc-server';
import { logger } from 'hono/logger';
import { app } from './app';
import { db } from './db';
import { env } from './env';
import { router } from './router';

app.use(logger());

app.use('/trpc/*', trpcServer({ createContext: () => ({ db }), router }));

serve({ fetch: app.fetch, hostname: env.HOSTNAME, port: env.PORT });

console.log(`⚡️ Serving Users API @ http://${env.HOSTNAME}:${env.PORT}`);
