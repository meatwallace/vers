import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { app } from './app';
import { initYoga } from './init-yoga';

app.use(logger());

initYoga();

serve({ fetch: app.fetch, port: 3000 });

console.log('⚡️ Serving GraphQL API @ http://localhost:3000/graphql');
