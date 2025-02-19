import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@chrono/postgres-schema';
import { z } from 'zod';
import { envSchema } from './env';

export type Env = z.infer<typeof envSchema>;

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
