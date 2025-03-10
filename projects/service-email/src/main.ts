import { serve } from '@hono/node-server';
import { trpcServer } from '@hono/trpc-server';
import { logger } from 'hono/logger';
import { app } from './app';
import { env } from './env';
import { logger as appLogger } from './logger';
import { router } from './router';

app.use(logger());

app.use('/trpc/*', trpcServer({ router }));

serve({ fetch: app.fetch, hostname: env.HOSTNAME, port: env.PORT });

appLogger.info(`Serving Email API @ http://${env.HOSTNAME}:${env.PORT}`);
