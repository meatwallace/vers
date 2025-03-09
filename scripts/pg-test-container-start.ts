import { PostgresTestUtils } from '@chrono/service-test-utils';

await PostgresTestUtils.startContainer({
  migrationPath: './projects/db-postgres/migrations',
  port: 32_999,
});

console.log('⚡ postgres test container started');
