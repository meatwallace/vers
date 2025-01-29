import { PostgresTestUtils } from './src/postgres-test-utils';
import { pgTestConfig } from './src/pg-test-config';

export async function setup() {
  await PostgresTestUtils.initialize(pgTestConfig);
}

export async function teardown() {
  await PostgresTestUtils.teardown();
}
