import { PostgresTestUtils } from '@chrono/service-test-utils';

await PostgresTestUtils.startContainer({ port: 32_999 });

console.log('⚡ postgres test container started');
