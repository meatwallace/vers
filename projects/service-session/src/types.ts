import * as schema from '@vers/postgres-schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { z } from 'zod';
import { envSchema } from './env';

export type Env = z.infer<typeof envSchema>;

export interface HandlerContext {
  db: PostgresJsDatabase<typeof schema>;
}

export interface CreateSessionInput {
  ipAddress: string;
  rememberMe: boolean;
  userID: string;
}

export interface RefreshTokensInput {
  refreshToken: string;
}

export interface Session {
  createdAt: Date;
  expiresAt: Date;
  id: string;
  refreshToken: string;
  updatedAt: Date;
  userID: string;
}

export interface TokenPayload {
  accessToken: string;
  refreshToken: string;
  session: Session;
}
