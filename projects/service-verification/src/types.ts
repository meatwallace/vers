import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@chrono/postgres-schema';
import { z } from 'zod';
import { envSchema } from './env';

export type Env = z.infer<typeof envSchema>;

export interface HandlerContext {
  db: PostgresJsDatabase<typeof schema>;
}

export interface CreateVerificationInput {
  type: string;
  target: string;
  period: number;
}

export interface VerifyCodeInput {
  code: string;
  type: string;
  target: string;
}

export interface Verification {
  id: string;
  code: string;
  type: string;
  target: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
