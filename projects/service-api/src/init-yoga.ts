import { createYoga } from 'graphql-yoga';
import { schema } from './schema';
import { env } from './env';
import { app } from './app';

export function initYoga() {
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
}
