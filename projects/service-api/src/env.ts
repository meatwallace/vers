import { cleanEnv, str, url } from 'envalid';
import { Env } from './types';

export const env: Env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  LOGGING: str({
    choices: ['debug', 'info', 'warn', 'error'],
    default: 'info',
  }),

  API_IDENTIFIER: str(),
  AUTH0_DOMAIN: str(),

  // service URLs
  USERS_API_URL: url(),
});
