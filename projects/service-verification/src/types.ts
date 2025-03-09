import * as schema from '@vers/postgres-schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { z } from 'zod';
import { envSchema } from './env';

export type Env = z.infer<typeof envSchema>;

export interface HandlerContext {
  db: PostgresJsDatabase<typeof schema>;
}

export interface CreateVerificationInput {
  period: number;
  target: string;
  type: string;
}

export interface VerifyCodeInput {
  code: string;
  target: string;
  type: string;
}

export interface Verification {
  code: string;
  createdAt: Date;
  expiresAt: Date;
  id: string;
  target: string;
  type: string;
  updatedAt: Date;
}
