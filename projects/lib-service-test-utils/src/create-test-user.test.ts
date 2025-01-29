import { PostgresTestUtils } from './postgres-test-utils';
import { createTestUser } from './create-test-user';
import { pgTestConfig } from './pg-test-config';

async function setupTest() {
  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  return { db, teardown };
}

test('it creates a test user with the expected data', async () => {
  const { db, teardown } = await setupTest();

  const user = await createTestUser({ db });

  expect(user).toMatchObject({
    id: expect.any(String),
    email: 'user@test.com',
    name: 'Test User',
    username: 'test_user',
    passwordHash: expect.any(String),
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  });

  await teardown();
});

test('it creates a passwordless user when password is null', async () => {
  const { db, teardown } = await setupTest();

  const user = await createTestUser({ db, user: { password: null } });

  expect(user.passwordHash).toBeNull();

  await teardown();
});

test('it allows overriding the default user data', async () => {
  const { db, teardown } = await setupTest();

  const user = await createTestUser({
    db,
    user: {
      email: 'test@test.com',
      name: 'Test User',
      username: 'test_user',
    },
  });

  expect(user.email).toBe('test@test.com');
  expect(user.name).toBe('Test User');
  expect(user.username).toBe('test_user');

  await teardown();
});
