import { createYoga } from 'graphql-yoga';
import { createAuthMiddleware } from '@chrono/service-utils';
import { schema } from './schema';
import { env } from './env';
import { app } from './app';
import { createYogaContext } from './create-yoga-context';

const tokenVerifierConfig = {
  issuer: env.API_IDENTIFIER,
  audience: env.API_IDENTIFIER,
  signingKey: env.JWT_SIGNING_SECRET,
};

const authMiddleware = createAuthMiddleware({ tokenVerifierConfig });

export function initYoga() {
  app.on(['GET', 'POST'], '/graphql', authMiddleware, async (honoCtx) => {
    const yoga = createYoga({
      logging: env.LOGGING,
      maskedErrors: env.isProduction,
      graphqlEndpoint: '/graphql',
      graphiql: env.isDevelopment,
      schema: schema,
      context: (yogaCtx) => createYogaContext(yogaCtx, honoCtx),
    });

    return yoga.fetch(honoCtx.req.raw, honoCtx.env);
  });
}
