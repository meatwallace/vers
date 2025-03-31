import path from 'node:path';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import * as schema from '@vers/postgres-schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

interface TestDBConfig {
  migrationsFolder?: string;
}

/**
 * Migrates the test template database.
 *
 * @param container - The testcontainers postgres container.
 */
export async function setupTestDB(
  container: StartedPostgreSqlContainer,
  config: TestDBConfig = {},
) {
  const client = postgres(container.getConnectionUri());
  const db = drizzle(client, { schema });

  const migrationsFolder =
    config.migrationsFolder ??
    path.join(process.cwd(), './projects/db-postgres/migrations');

  await migrate(db, { migrationsFolder });

  await client.end();
}
