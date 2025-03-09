import * as schema from '@chrono/postgres-schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { z } from 'zod';
import { envSchema } from './env';

export type Env = z.infer<typeof envSchema>;

export interface HandlerContext {
  db: PostgresJsDatabase<typeof schema>;
}
