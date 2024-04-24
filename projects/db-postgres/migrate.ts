import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './src/db';
import { pg } from './src/pg';

await migrate(db, { migrationsFolder: './migrations' });

await pg.end();
