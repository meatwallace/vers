import { drop } from '@mswjs/data';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { db } from '~/mocks/db';
import { resolve } from './start-email-sign-up';

test('it starts the email signup process', async () => {
  const ctx = createMockGQLContext({});
  const args = {
    input: {
      email: 'user@test.com',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    success: true,
  });

  drop(db);
});

test('it returns success if the user already exists', async () => {
  db.user.create({
    email: 'user@test.com',
    name: 'Test User',
    username: 'test_user',
  });

  const ctx = createMockGQLContext({});

  const args = {
    input: {
      email: 'user@test.com',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    success: true,
  });

  drop(db);
});
