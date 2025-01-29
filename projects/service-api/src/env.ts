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
  JWT_SIGNING_SECRET: str(),

  APP_WEB_URL: url(),
  // service URLs
  EMAILS_SERVICE_URL: url(),
  SESSIONS_SERVICE_URL: url(),
  USERS_SERVICE_URL: url(),
  VERIFICATIONS_SERVICE_URL: url(),
  WORLDS_SERVICE_URL: url(),
});
