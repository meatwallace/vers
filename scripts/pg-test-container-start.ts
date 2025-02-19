import { PostgresTestUtils } from '@chrono/service-test-utils';

await PostgresTestUtils.startContainer({
  port: 32_999,
  migrationPath: './projects/db-postgres/migrations',
});

console.log('⚡ postgres test container started');
