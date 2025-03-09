import { PostgresTestUtils } from '@vers/service-test-utils';

await PostgresTestUtils.startContainer({
  migrationPath: './projects/db-postgres/migrations',
  port: 32_999,
});

console.log('⚡ postgres test container started');
