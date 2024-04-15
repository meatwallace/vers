import { cleanEnv, str } from 'envalid';
import { Env } from './types';

export const env: Env = cleanEnv(process.env, {
  LOGGING: str({
    choices: ['debug', 'info', 'warn', 'error'],
    default: 'info',
  }),
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
});
