import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { createYoga } from 'graphql-yoga';
import { schema } from '../schema';
import { env } from '../env';

const yoga = createYoga({
  logging: env.LOGGING,
  maskedErrors: env.isProduction,
  graphqlEndpoint: '/graphql',
  graphiql: env.isDevelopment,
  schema: schema,
});

export const executor = buildHTTPExecutor({
  fetch: yoga.fetch,
});
