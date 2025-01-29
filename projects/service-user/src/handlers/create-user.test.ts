import bcrypt from 'bcryptjs';
import invariant from 'tiny-invariant';
import { Hono } from 'hono';
import { test, expect } from 'vitest';
import { PostgresTestUtils } from '@chrono/service-test-utils';
import { createUser } from './create-user';
import { pgTestConfig } from '../pg-test-config';

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
    method: 'POST',
    body: JSON.stringify({
      email: 'user@test.com',
      name: 'Test User',
      username: 'test_user',
      password,
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: {
      id: expect.any(String),
      email: 'user@test.com',
      name: 'Test User',
      username: 'test_user',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
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
    method: 'POST',
    body: JSON.stringify({
      email: 'user@test.com',
      name: 'Test User',
      username: 'test_user',
      password: 'password123',
    }),
  });

  await app.request(req1);

  // try to create another user with the same email
  const req2 = new Request('http://localhost/create-user', {
    method: 'POST',
    body: JSON.stringify({
      email: 'user@test.com',
      name: 'Another User',
      username: 'another_user',
      password: 'password456',
    }),
  });

  const res = await app.request(req2);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: false,
    error: 'A user with that email already exists',
  });

  await teardown();
});

test('it returns an error if a user with that username already exists', async () => {
  const { app, teardown } = await setupTest();

  const req1 = new Request('http://localhost/create-user', {
    method: 'POST',
    body: JSON.stringify({
      email: 'user1@test.com',
      name: 'Test User',
      username: 'test_user',
      password: 'password123',
    }),
  });

  await app.request(req1);

  // try to create another user with the same username
  const req2 = new Request('http://localhost/create-user', {
    method: 'POST',
    body: JSON.stringify({
      email: 'user2@test.com',
      name: 'Another User',
      username: 'test_user',
      password: 'password456',
    }),
  });

  const res = await app.request(req2);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: false,
    error: 'A user with that username already exists',
  });

  await teardown();
});

test('it handles invalid request body', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/create-user', {
    method: 'POST',
    body: 'invalid json',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: false,
    error: 'An unknown error occurred',
  });

  await teardown();
});
