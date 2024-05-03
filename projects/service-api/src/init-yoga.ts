import { YogaInitialContext, createYoga } from 'graphql-yoga';
import {
  createAuthMiddleware,
  getTokenFromHeader,
} from '@chrononomicon/service-utils';
import { users } from '@chrononomicon/postgres-schema';
import { schema } from './schema';
import { env } from './env';
import { app } from './app';
import { createUserService, createWorldService } from './services';
import { Context } from './types';

const authMiddleware = createAuthMiddleware({
  tokenVerifierConfig: {
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.AUTH0_DOMAIN}/`,
  },
});

export function initYoga() {
  app.on(['GET', 'POST'], '/graphql', authMiddleware, async (ctx) => {
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

// TODO: move this to a separate file & test
export async function createYogaContext(
  ctx: YogaInitialContext,
): Promise<Context> {
  const authHeader = ctx.request.headers.get('authorization');
  const accessToken = getTokenFromHeader(authHeader);

  const userService = createUserService({
    apiURL: env.USERS_SERVICE_URL,
    accessToken,
  });

  const worldService = createWorldService({
    apiURL: env.WORLDS_SERVICE_URL,
    accessToken,
  });

  let user: typeof users.$inferSelect | null = null;

  try {
    user = await userService.getCurrentUser({});
  } catch {
    // it's fine if we don't find our user; we explicitly check on each resolver that requires
    // auth, and if the user is brand new, their record may not be created yet.
  }

  return {
    request: ctx.request,
    user,
    services: {
      user: userService,
      world: worldService,
    },
  };
}
