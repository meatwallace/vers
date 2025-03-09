import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { createYoga } from 'graphql-yoga';
import { env } from '../env';
import { schema } from '../schema';

const yoga = createYoga({
  graphiql: env.isDevelopment,
  graphqlEndpoint: '/graphql',
  logging: env.LOGGING,
  maskedErrors: env.isProduction,
  schema: schema,
});

export const executor = buildHTTPExecutor({
  // eslint-disable-next-line @typescript-eslint/unbound-method
  fetch: yoga.fetch,
});
