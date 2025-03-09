import { drop } from '@mswjs/data';
import invariant from 'tiny-invariant';
import { db } from '~/mocks/db';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { resolve } from './login-with-password';

test('it returns an auth payload when credentials are valid and 2FA is not enabled', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    passwordHash: 'password123',
  });

  const ctx = createMockGQLContext({});
  const args = {
    input: {
      email: user.email,
      password: 'password123',
      rememberMe: true,
    },
  };

  const result = await resolve({}, args, ctx);

  const session = db.session.findFirst({
    where: {
      userID: { equals: user.id },
    },
  });

  expect(result).toMatchObject({
    accessToken: expect.any(String),
    refreshToken: expect.any(String),
    session: {
      expiresAt: expect.any(Date),
      id: expect.any(String),
      ipAddress: ctx.ipAddress,
      userID: user.id,
    },
  });

  invariant('refreshToken' in result);

  expect(session).not.toBeNull();
  expect(session?.userID).toBe(user.id);
  expect(session?.refreshToken).toBe(result.refreshToken);

  drop(db);
});

test('it returns an unverified auth payload when 2FA is enabled', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    passwordHash: 'password123',
  });

  db.verification.create({
    target: user.email,
    type: '2fa',
  });

  const ctx = createMockGQLContext({});

  const args = {
    input: {
      email: user.email,
      password: 'password123',
      rememberMe: true,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    transactionID: expect.any(String),
  });

  drop(db);
});

test('it returns an error when the user does not exist', async () => {
  const ctx = createMockGQLContext({});
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
      message: 'Wrong email or password',
      title: 'Invalid credentials',
    },
  });

  drop(db);
});

test('it returns an error when the password is incorrect', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    passwordHash: 'password123',
  });

  const ctx = createMockGQLContext({});
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
      message: 'Wrong email or password',
      title: 'Invalid credentials',
    },
  });

  drop(db);
});
