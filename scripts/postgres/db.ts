import * as schema from '@vers/postgres-schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import { pg } from './pg.ts';

export const db = drizzle(pg, { schema });
