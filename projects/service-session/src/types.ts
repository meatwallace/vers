import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@chrono/postgres-schema';
import { z } from 'zod';
import { envSchema } from './env';

export type Env = z.infer<typeof envSchema>;

export interface HandlerContext {
  db: PostgresJsDatabase<typeof schema>;
}

export interface CreateSessionInput {
  userID: string;
  ipAddress: string;
  rememberMe: boolean;
}

export interface RefreshTokensInput {
  refreshToken: string;
}

export interface Session {
  id: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  userID: string;
}

export interface TokenPayload {
  accessToken: string;
  refreshToken: string;
  session: Session;
}
