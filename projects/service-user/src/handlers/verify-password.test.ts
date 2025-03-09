import { expect, test } from 'vitest';
import { createTestUser, PostgresTestUtils } from '@vers/service-test-utils';
import { Hono } from 'hono';
import { pgTestConfig } from '../pg-test-config';
import { verifyPassword } from './verify-password';

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
    body: JSON.stringify({
      email: user.email,
      password: 'password123',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toEqual({
    data: {},
    success: true,
  });

  await teardown();
});

test('it rejects an incorrect password', async () => {
  const { app, db, teardown } = await setupTest();

  const user = await createTestUser({ db, user: { password: 'password123' } });

  const req = new Request('http://localhost/verify-password', {
    body: JSON.stringify({
      email: user.email,
      password: 'wrongpassword',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toEqual({
    error: 'Incorrect password',
    success: false,
  });

  await teardown();
});

test('it rejects a non-existent user', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/verify-password', {
    body: JSON.stringify({
      email: 'nonexistent@test.com',
      password: 'password123',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toEqual({
    error: 'No user with that email',
    success: false,
  });

  await teardown();
});

test('it rejects a user without a password set', async () => {
  const { app, db, teardown } = await setupTest();

  const user = await createTestUser({ db, user: { password: null } });

  const req = new Request('http://localhost/verify-password', {
    body: JSON.stringify({
      email: user.email,
      password: 'password123',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toEqual({
    error: 'User does not have a password set',
    success: false,
  });

  await teardown();
});

test('it handles invalid request body', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/verify-password', {
    body: 'invalid json',
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toEqual({
    error: 'An unknown error occurred',
    success: false,
  });

  await teardown();
});
