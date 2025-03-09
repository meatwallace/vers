import { createLogger } from '@vers/service-utils';
import { env } from './env';

export const logger = createLogger({
  level: env.LOGGING,
  pretty: env.NODE_ENV === 'development',
});
