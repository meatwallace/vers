import { expect, test } from 'vitest';
import { createTestUser, PostgresTestUtils } from '@chrono/service-test-utils';
import { Hono } from 'hono';
import { pgTestConfig } from '../pg-test-config';
import { getUser } from './get-user';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const user = await createTestUser({ db });

  app.post('/get-user', async (ctx) => getUser(ctx, db));

  return { app, db, teardown, user };
}

test('it gets a user by ID', async () => {
  const { app, teardown, user } = await setupTest();

  const req = new Request('http://localhost/get-user', {
    body: JSON.stringify({
      id: user.id,
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: {
      createdAt: expect.any(String),
      email: user.email,
      id: user.id,
    },
    success: true,
  });

  await teardown();
});

test('it gets a user by email', async () => {
  const { app, teardown, user } = await setupTest();

  const req = new Request('http://localhost/get-user', {
    body: JSON.stringify({
      email: user.email,
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: {
      createdAt: expect.any(String),
      email: user.email,
      id: user.id,
    },
    success: true,
  });

  await teardown();
});

test('it handles a non-existent user', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/get-user', {
    body: JSON.stringify({
      id: 'non-existent-id',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: null,
    success: true,
  });

  await teardown();
});

test('it handles missing search parameters', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/get-user', {
    body: JSON.stringify({}),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    error: 'Either email or id must be provided',
    success: false,
  });

  await teardown();
});

test('it handles an invalid request body', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/get-user', {
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
