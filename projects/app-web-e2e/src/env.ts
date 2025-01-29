import { cleanEnv, str } from 'envalid';
import { Env } from './types';

export const env: Env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'e2e', 'production'] }),
  LOGGING: str({
    choices: ['debug', 'info', 'warn', 'error'],
    default: 'info',
  }),

  // TEST_USER_EMAIL: str(),
  // TEST_USER_PASSWORD: str(),
});
