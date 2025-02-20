import { PostgresTestUtils } from '@chrono/service-test-utils';

// if the container is running, this does nothing except create a reference to it
// so we can stop it
await PostgresTestUtils.startContainer({
  port: 32_999,
  migrationPath: './projects/db-postgres/migrations',
});

await PostgresTestUtils.stopContainer();

console.log('💤 postgres test container stopped');
