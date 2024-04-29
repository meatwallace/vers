import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import {
  createTokenVerifier,
  TokenVerifierConfig,
} from '../utils/create-token-verifier.js';
import { getTokenFromHeader } from '../utils/get-token-from-header';

type AuthMiddlewareConfig = {
  tokenVerifierConfig: TokenVerifierConfig;
};

// this is adapted from the generic jwt middleware for hono
// ref: https://github.com/honojs/hono/blob/d091c6a180887d69715abcd84ea88a123c876305/src/middleware/jwt/index.test.ts
export function createAuthMiddleware(config: AuthMiddlewareConfig) {
  const verifyToken = createTokenVerifier({
    audience: config.tokenVerifierConfig.audience,
    issuer: config.tokenVerifierConfig.issuer,
  });

  return async (ctx: Context, next: Next) => {
    const authHeader = ctx.req.raw.headers.get('Authorization');

    if (!authHeader) {
      const errorDescription = 'no authorization included in request';

      throw new HTTPException(401, {
        message: errorDescription,
        res: createUnauthorizedResponse({
          error: 'invalid_request',
          description: errorDescription,
          ctx,
        }),
      });
    }

    const token = getTokenFromHeader(authHeader);

    if (!token) {
      const errorDescription = 'invalid authorization header structure';

      throw new HTTPException(401, {
        message: errorDescription,
        res: createUnauthorizedResponse({
          error: 'invalid_request',
          description: errorDescription,
          ctx,
        }),
      });
    }

    try {
      const payload = await verifyToken(token);

      ctx.set('token', token);
      ctx.set('jwtPayload', payload);
    } catch (error: unknown) {
      throw new HTTPException(401, {
        message: 'Unauthorized',
        res: createUnauthorizedResponse({
          ctx,
          error: 'invalid_token',
          statusText: 'Unauthorized',
          description: 'token verification failure',
        }),
        cause: error,
      });
    }

    await next();
  };
}

type ErrorParts = {
  error: string;
  description: string;
  statusText?: string;
  ctx: Context;
};

function createUnauthorizedResponse(error: ErrorParts) {
  return new Response('Unauthorized', {
    status: 401,
    statusText: error.statusText,
    headers: {
      'WWW-Authenticate': `Bearer realm="${error.ctx.req.url}",error="${error.error}",error_description="${error.description}"`,
    },
  });
}
