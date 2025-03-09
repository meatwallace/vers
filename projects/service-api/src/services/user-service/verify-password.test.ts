import { expect, test } from 'vitest';
import { ServiceID } from '@chrono/service-types';
import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils/create-service-context';
import { verifyPassword } from './verify-password';

test('it verifies a valid password', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    name: 'Test User',
    passwordHash: 'password123',
    username: 'test_user',
  });

  const ctx = createServiceContext({
    apiURL: env.USERS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
  });

  const result = await verifyPassword(
    {
      email: user.email,
      password: 'password123',
    },
    ctx,
  );

  expect(result).toMatchObject({ success: true });

  drop(db);
});

test('it returns null for invalid credentials', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    name: 'Test User',
    passwordHash: 'password123',
    username: 'test_user',
  });

  const ctx = createServiceContext({
    apiURL: env.USERS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
  });

  const result = await verifyPassword(
    {
      email: user.email,
      password: 'wrongpassword',
    },
    ctx,
  );

  expect(result).toMatchObject({ error: 'Incorrect password', success: false });

  drop(db);
});

test('it returns null if the user does not exist', async () => {
  const ctx = createServiceContext({
    apiURL: env.USERS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
  });

  const result = await verifyPassword(
    {
      email: 'nonexistent@test.com',
      password: 'password123',
    },
    ctx,
  );

  expect(result).toMatchObject({
    error: 'No user with that email',
    success: false,
  });

  drop(db);
});

test('it returns null if the user has no password set', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    name: 'Test User',
    passwordHash: null,
    username: 'test_user',
  });

  const ctx = createServiceContext({
    apiURL: env.USERS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
  });

  const result = await verifyPassword(
    {
      email: user.email,
      password: 'password123',
    },
    ctx,
  );

  expect(result).toMatchObject({
    error: 'User does not have a password set',
    success: false,
  });

  drop(db);
});
