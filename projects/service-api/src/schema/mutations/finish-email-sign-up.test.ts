import { drop } from '@mswjs/data';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { db } from '~/mocks/db';
import { resolve } from './finish-email-sign-up';

test('it completes the email signup process', async () => {
  const ctx = createMockGQLContext({});

  const args = {
    input: {
      email: 'user@test.com',
      name: 'Test User',
      username: 'test_user',
      password: 'password123',
      rememberMe: true,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    accessToken: expect.any(String),
    refreshToken: expect.any(String),
    session: {
      id: expect.any(String),
      userID: expect.any(String),
      ipAddress: '127.0.0.1',
      expiresAt: expect.any(Date),
    },
  });

  const user = db.user.findFirst({
    where: { email: { equals: args.input.email } },
  });

  expect(user).toMatchObject({
    email: args.input.email,
    name: args.input.name,
    username: args.input.username,
  });

  drop(db);
});

test('it returns an error if the user already exists', async () => {
  db.user.create({
    email: 'user@test.com',
    name: 'Existing User',
    username: 'existing_user',
  });

  const ctx = createMockGQLContext({});
  const args = {
    input: {
      email: 'user@test.com',
      name: 'Test User',
      username: 'test_user',
      password: 'password123',
      rememberMe: true,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    error: {
      title: 'User already exists',
      message: 'A user already exists with this email',
    },
  });

  drop(db);
});
