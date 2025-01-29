import { Hono } from 'hono';
import { test, expect } from 'vitest';
import { PostgresTestUtils, createTestUser } from '@chrono/service-test-utils';
import { getUser } from './get-user';
import { pgTestConfig } from '../pg-test-config';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const user = await createTestUser({ db });

  app.post('/get-user', async (ctx) => getUser(ctx, db));

  return { app, db, teardown, user };
}

test('it gets a user by ID', async () => {
  const { app, user, teardown } = await setupTest();

  const req = new Request('http://localhost/get-user', {
    method: 'POST',
    body: JSON.stringify({
      id: user.id,
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      createdAt: expect.any(String),
    },
  });

  await teardown();
});

test('it gets a user by email', async () => {
  const { app, user, teardown } = await setupTest();

  const req = new Request('http://localhost/get-user', {
    method: 'POST',
    body: JSON.stringify({
      email: user.email,
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      createdAt: expect.any(String),
    },
  });

  await teardown();
});

test('it handles a non-existent user', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/get-user', {
    method: 'POST',
    body: JSON.stringify({
      id: 'non-existent-id',
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: null,
  });

  await teardown();
});

test('it handles missing search parameters', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/get-user', {
    method: 'POST',
    body: JSON.stringify({}),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: false,
    error: 'Either email or id must be provided',
  });

  await teardown();
});

test('it handles an invalid request body', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/get-user', {
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
