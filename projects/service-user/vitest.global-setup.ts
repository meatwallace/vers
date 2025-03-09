import { PostgresTestUtils } from '@vers/service-test-utils';
import { pgTestConfig } from './src/pg-test-config';

export async function setup() {
  await PostgresTestUtils.initialize(pgTestConfig);
}

export async function teardown() {
  await PostgresTestUtils.teardown();
}
