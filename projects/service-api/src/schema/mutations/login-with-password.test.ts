import { drop } from '@mswjs/data';
import { db } from '~/mocks/db';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { resolve } from './login-with-password';

test('it logs in a user with valid credentials', async () => {
  const user = db.user.create({
    passwordHash: 'password123',
  });

  const ctx = createMockGQLContext({
    ipAddress: '127.0.0.1',
  });

  const args = {
    input: {
      email: user.email,
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
      userID: user.id,
      ipAddress: '127.0.0.1',
      expiresAt: expect.any(Date),
    },
  });

  drop(db);
});

test('it returns an error if the user does not exist', async () => {
  const ctx = createMockGQLContext({
    ipAddress: '127.0.0.1',
  });

  const args = {
    input: {
      email: 'nonexistent@test.com',
      password: 'password123',
      rememberMe: true,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    error: {
      title: 'Invalid credentials',
      message: 'No user with that email',
    },
  });

  drop(db);
});

test('it returns an error if the password is incorrect', async () => {
  const user = db.user.create({
    passwordHash: 'password123',
  });

  const ctx = createMockGQLContext({
    ipAddress: '127.0.0.1',
  });

  const args = {
    input: {
      email: user.email,
      password: 'wrongpassword',
      rememberMe: true,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    error: {
      title: 'Invalid credentials',
      message: 'Incorrect password',
    },
  });

  drop(db);
});

test('it returns an error if the user has no password set', async () => {
  const user = db.user.create({
    passwordHash: null,
  });

  const ctx = createMockGQLContext({
    ipAddress: '127.0.0.1',
  });

  const args = {
    input: {
      email: user.email,
      password: 'password123',
      rememberMe: true,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    error: {
      title: 'Invalid credentials',
      message: 'User does not have a password set',
    },
  });

  drop(db);
});
