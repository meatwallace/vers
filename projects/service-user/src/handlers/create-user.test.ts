import { expect, test } from 'vitest';
import { PostgresTestUtils } from '@chrono/service-test-utils';
import bcrypt from 'bcryptjs';
import { Hono } from 'hono';
import invariant from 'tiny-invariant';
import { pgTestConfig } from '../pg-test-config';
import { createUser } from './create-user';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  app.post('/create-user', async (ctx) => createUser(ctx, db));

  return { app, db, teardown };
}

test('it creates a user with a hashed password', async () => {
  const { app, db, teardown } = await setupTest();

  const password = 'password123';

  const req = new Request('http://localhost/create-user', {
    body: JSON.stringify({
      email: 'user@test.com',
      name: 'Test User',
      password,
      username: 'test_user',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: {
      createdAt: expect.any(String),
      email: 'user@test.com',
      id: expect.any(String),
      name: 'Test User',
      updatedAt: expect.any(String),
      username: 'test_user',
    },
    success: true,
  });

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, 'user@test.com'),
  });

  invariant(user?.passwordHash, 'user with password hash must be created');

  expect(await bcrypt.compare(password, user.passwordHash)).toBe(true);

  await teardown();
});

test('it returns an error if a user with that email already exists', async () => {
  const { app, teardown } = await setupTest();

  const req1 = new Request('http://localhost/create-user', {
    body: JSON.stringify({
      email: 'user@test.com',
      name: 'Test User',
      password: 'password123',
      username: 'test_user',
    }),
    method: 'POST',
  });

  await app.request(req1);

  // try to create another user with the same email
  const req2 = new Request('http://localhost/create-user', {
    body: JSON.stringify({
      email: 'user@test.com',
      name: 'Another User',
      password: 'password456',
      username: 'another_user',
    }),
    method: 'POST',
  });

  const res = await app.request(req2);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    error: 'A user with that email already exists',
    success: false,
  });

  await teardown();
});

test('it returns an error if a user with that username already exists', async () => {
  const { app, teardown } = await setupTest();

  const req1 = new Request('http://localhost/create-user', {
    body: JSON.stringify({
      email: 'user1@test.com',
      name: 'Test User',
      password: 'password123',
      username: 'test_user',
    }),
    method: 'POST',
  });

  await app.request(req1);

  // try to create another user with the same username
  const req2 = new Request('http://localhost/create-user', {
    body: JSON.stringify({
      email: 'user2@test.com',
      name: 'Another User',
      password: 'password456',
      username: 'test_user',
    }),
    method: 'POST',
  });

  const res = await app.request(req2);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    error: 'A user with that username already exists',
    success: false,
  });

  await teardown();
});

test('it handles invalid request body', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/create-user', {
    body: 'invalid json',
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    error: 'An unknown error occurred',
    success: false,
  });

  await teardown();
});
