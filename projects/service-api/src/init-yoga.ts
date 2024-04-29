import { YogaInitialContext, createYoga } from 'graphql-yoga';
import { schema } from './schema';
import { env } from './env';
import { app } from './app';
import { createUserService } from './services/user-service/create-user-service';
import { getTokenFromHeader } from '@campaign/service-utils';

export function initYoga() {
  app.on(['GET', 'POST'], '/graphql', async (ctx) => {
    const yoga = createYoga({
      logging: env.LOGGING,
      maskedErrors: env.isProduction,
      graphqlEndpoint: '/graphql',
      graphiql: env.isDevelopment,
      schema: schema,
      context: createYogaContext,
    });

    return yoga.fetch(ctx.req.raw, ctx.env);
  });
}

export function createYogaContext(ctx: YogaInitialContext) {
  const authHeader = ctx.request.headers.get('authorization');

  return {
    request: ctx.request,
    services: {
      users: createUserService({
        accessToken: getTokenFromHeader(authHeader),
        apiURL: env.USERS_API_URL,
      }),
    },
  };
}
