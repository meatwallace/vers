import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@chrono/postgres-schema';

export type Env = {
  HOSTNAME: string;
  PORT: number;
  POSTGRES_URL: string;
  API_IDENTIFIER: string;
  LOGGING: 'debug' | 'info' | 'warn' | 'error';
  NODE_ENV: 'development' | 'test' | 'production';
  isProduction: boolean;
  isDevelopment: boolean;
};

export type HandlerContext = {
  db: PostgresJsDatabase<typeof schema>;
};
