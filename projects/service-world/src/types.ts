import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@chrono/postgres-schema';
import { z } from 'zod';
import { envSchema } from './env';

export type Env = z.infer<typeof envSchema>;

export type HandlerContext = {
  db: PostgresJsDatabase<typeof schema>;
};
