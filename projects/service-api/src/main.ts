import { Hono } from 'hono';
import { serve, type HttpBindings } from '@hono/node-server';
import { createYoga } from 'graphql-yoga';
import { env } from './env.js';
import { schema } from './schema/index.js';

type Bindings = HttpBindings;

const app = new Hono<{ Bindings: Bindings }>();

app.on(['GET', 'POST'], '/graphql', async (ctx) => {
  const yoga = createYoga({
    logging: env.LOGGING,
    maskedErrors: env.isProduction,
    graphqlEndpoint: '/graphql',
    graphiql: env.isDevelopment,
    schema: schema,
  });

  return yoga.fetch(ctx.req.raw, ctx.env);
});

serve(app);

console.log('⚡️ Serving GraphQL API @ http://localhost:3000/graphql');
