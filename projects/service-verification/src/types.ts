import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@chrono/postgres-schema';
import { z } from 'zod';
import { envSchema } from './env';

export type Env = z.infer<typeof envSchema>;

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
