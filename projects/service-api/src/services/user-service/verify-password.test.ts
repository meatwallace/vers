import { test, expect } from 'vitest';
import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { ServiceID } from '@chrono/service-types';
import { verifyPassword } from './verify-password';
import { createServiceContext } from '../utils/create-service-context';
import { env } from '~/env';
import { db } from '~/mocks/db';

test('it verifies a valid password', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    name: 'Test User',
    username: 'test_user',
    passwordHash: 'password123',
  });

  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
    apiURL: env.USERS_SERVICE_URL,
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
    username: 'test_user',
    passwordHash: 'password123',
  });

  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
    apiURL: env.USERS_SERVICE_URL,
  });

  const result = await verifyPassword(
    {
      email: user.email,
      password: 'wrongpassword',
    },
    ctx,
  );

  expect(result).toMatchObject({ success: false, error: 'Incorrect password' });

  drop(db);
});

test('it returns null if the user does not exist', async () => {
  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
    apiURL: env.USERS_SERVICE_URL,
  });

  const result = await verifyPassword(
    {
      email: 'nonexistent@test.com',
      password: 'password123',
    },
    ctx,
  );

  expect(result).toMatchObject({
    success: false,
    error: 'No user with that email',
  });

  drop(db);
});

test('it returns null if the user has no password set', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    name: 'Test User',
    username: 'test_user',
    passwordHash: null,
  });

  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
    apiURL: env.USERS_SERVICE_URL,
  });

  const result = await verifyPassword(
    {
      email: user.email,
      password: 'password123',
    },
    ctx,
  );

  expect(result).toMatchObject({
    success: false,
    error: 'User does not have a password set',
  });

  drop(db);
});
