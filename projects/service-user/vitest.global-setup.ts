import { PostgresTestUtils } from '@chrononomicon/service-test-utils';

export async function setup() {
  await PostgresTestUtils.initialize();
}

export async function teardown() {
  await PostgresTestUtils.teardown();
}
