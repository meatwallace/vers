import { cleanEnv, num, str, url } from 'envalid';
import { Env } from './types';

export const env: Env = cleanEnv(process.env, {
  HOSTNAME: str(),
  PORT: num(),

  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  LOGGING: str({
    choices: ['debug', 'info', 'warn', 'error'],
    default: 'info',
  }),

  API_IDENTIFIER: str(),
  AUTH0_DOMAIN: str(),

  // service URLs
  USERS_SERVICE_URL: url(),
  WORLDS_SERVICE_URL: url(),
});
