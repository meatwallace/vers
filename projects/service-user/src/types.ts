import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@campaign/postgres-schema';

export type Env = {
  POSTGRES_URL: string;
  AUTH0_DOMAIN: string;
  API_IDENTIFIER: string;
  LOGGING: 'debug' | 'info' | 'warn' | 'error';
  NODE_ENV: 'development' | 'test' | 'production';
  isProduction: boolean;
  isDevelopment: boolean;
};

export type HandlerContext = {
  db: PostgresJsDatabase<typeof schema>;
};
