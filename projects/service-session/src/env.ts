import { cleanEnv, num, str } from 'envalid';
import { Env } from './types';

export const env: Env = cleanEnv(process.env, {
  HOSTNAME: str(),
  PORT: num(),
  POSTGRES_URL: str(),
  API_IDENTIFIER: str(),
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  LOGGING: str({
    choices: ['debug', 'info', 'warn', 'error'],
    default: 'info',
  }),
  JWT_SIGNING_SECRET: str(),
});
