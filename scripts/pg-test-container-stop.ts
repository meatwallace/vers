import { PostgresTestUtils } from '@chrono/service-test-utils';

// if the container is running, this does nothing except create a reference to it
// so we can stop it
await PostgresTestUtils.startContainer({
  migrationPath: './projects/db-postgres/migrations',
  port: 32_999,
});

await PostgresTestUtils.stopContainer();

console.log('💤 postgres test container stopped');
