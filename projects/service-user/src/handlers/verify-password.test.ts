import { Hono } from 'hono';
import { test, expect } from 'vitest';
import { PostgresTestUtils, createTestUser } from '@chrono/service-test-utils';
import { verifyPassword } from './verify-password';
import { pgTestConfig } from '../pg-test-config';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  app.post('/verify-password', async (ctx) => verifyPassword(ctx, db));

  return { app, db, teardown };
}

test('it verifies a correct password', async () => {
  const { app, db, teardown } = await setupTest();

  const user = await createTestUser({ db, user: { password: 'password123' } });

  const req = new Request('http://localhost/verify-password', {
    method: 'POST',
    body: JSON.stringify({
      email: user.email,
      password: 'password123',
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toEqual({
    success: true,
    data: {},
  });

  await teardown();
});

test('it rejects an incorrect password', async () => {
  const { app, db, teardown } = await setupTest();

  const user = await createTestUser({ db, user: { password: 'password123' } });

  const req = new Request('http://localhost/verify-password', {
    method: 'POST',
    body: JSON.stringify({
      email: user.email,
      password: 'wrongpassword',
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toEqual({
    success: false,
    error: 'Incorrect password',
  });

  await teardown();
});

test('it rejects a non-existent user', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/verify-password', {
    method: 'POST',
    body: JSON.stringify({
      email: 'nonexistent@test.com',
      password: 'password123',
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toEqual({
    success: false,
    error: 'No user with that email',
  });

  await teardown();
});

test('it rejects a user without a password set', async () => {
  const { app, db, teardown } = await setupTest();

  const user = await createTestUser({ db, user: { password: null } });

  const req = new Request('http://localhost/verify-password', {
    method: 'POST',
    body: JSON.stringify({
      email: user.email,
      password: 'password123',
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toEqual({
    success: false,
    error: 'User does not have a password set',
  });

  await teardown();
});

test('it handles invalid request body', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/verify-password', {
    method: 'POST',
    body: 'invalid json',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toEqual({
    success: false,
    error: 'An unknown error occurred',
  });

  await teardown();
});
