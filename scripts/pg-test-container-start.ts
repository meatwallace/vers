import { createPostgresContainer, setupTestDB } from '@vers/service-test-utils';

const container = await createPostgresContainer();

await setupTestDB(container, {
  migrationsFolder: './projects/db-postgres/migrations',
});

console.log('⚡ postgres test container started');
