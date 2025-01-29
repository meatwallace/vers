import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@chrono/postgres-schema';
import { pg } from './pg';

export const db = drizzle(pg, { schema });
