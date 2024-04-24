import { createAuthMiddleware } from '@campaign/service-utils';
import { env } from '../env';

export const authMiddleware = createAuthMiddleware({
  tokenVerifierConfig: {
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.AUTH0_DOMAIN}/`,
  },
});
