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

export type CreateVerificationInput = {
  type: string;
  target: string;
  period: number;
};

export type VerifyCodeInput = {
  code: string;
  type: string;
  target: string;
};

export type Verification = {
  id: string;
  code: string;
  type: string;
  target: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
