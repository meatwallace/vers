import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@chrono/postgres-schema';

export type Env = {
  HOSTNAME: string;
  PORT: number;
  POSTGRES_URL: string;
  API_IDENTIFIER: string;
  LOGGING: 'debug' | 'info' | 'warn' | 'error';
  NODE_ENV: 'development' | 'test' | 'production';
  JWT_SIGNING_SECRET: string;
  isProduction: boolean;
  isDevelopment: boolean;
};

export type HandlerContext = {
  db: PostgresJsDatabase<typeof schema>;
};

export type CreateSessionInput = {
  userID: string;
  ipAddress: string;
  rememberMe: boolean;
};

export type RefreshTokensInput = {
  refreshToken: string;
};

export type Session = {
  id: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  userID: string;
};

export type TokenPayload = {
  accessToken: string;
  refreshToken: string;
  session: Session;
};
