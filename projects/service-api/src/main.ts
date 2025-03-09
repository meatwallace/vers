import { serve } from '@hono/node-server';
import { createLoggerMiddleware } from '@vers/service-utils';
import { requestId } from 'hono/request-id';
import { app } from './app';
import { env } from './env';
import { initYoga } from './init-yoga';
import { logger } from './logger';
import { createRemoteAddressMiddleware } from './middleware/create-remote-address-middleware';
import { createSessionHeaderMiddleware } from './middleware/create-session-header-middleware';

app.use('*', requestId());
app.use('*', createRemoteAddressMiddleware());
app.use('*', createSessionHeaderMiddleware());
app.use('*', createLoggerMiddleware(logger));

initYoga();

serve({ fetch: app.fetch, hostname: env.HOSTNAME, port: env.PORT });

logger.info(`Serving GraphQL API @ http://${env.HOSTNAME}:${env.PORT}`);
