import * as schema from '@campaign/postgres-schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import { pg } from './pg';

export const db = drizzle(pg, { schema });
