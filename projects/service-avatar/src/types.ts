import * as schema from '@vers/postgres-schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { z } from 'zod';
import { envSchema } from './env';

export type Env = z.infer<typeof envSchema>;

export interface Context {
  db: PostgresJsDatabase<typeof schema>;
}
