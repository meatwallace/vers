import { serve } from '@hono/node-server';
import { app } from './app';
import { initYoga } from './init-yoga';

initYoga();
serve(app);

console.log('⚡️ Serving GraphQL API @ http://localhost:3000/graphql');
