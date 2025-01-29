import { Hono } from 'hono';
import { test, expect } from 'vitest';
import { createTestUser, PostgresTestUtils } from '@chrono/service-test-utils';
import * as schema from '@chrono/postgres-schema';
import { deleteSession } from './delete-session';
import { pgTestConfig } from '../pg-test-config';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  app.post('/delete-session', async (ctx) => deleteSession(ctx, db));

  return { app, db, teardown };
}

test('it deletes a session', async () => {
  const { app, db, teardown } = await setupTest();

  const user = await createTestUser({ db });

  const session = {
    id: 'test_session_id',
    userID: user.id,
    ipAddress: '127.0.0.1',
    refreshToken: 'test_refresh_token',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.insert(schema.sessions).values(session);

  const req = new Request('http://localhost/delete-session', {
    method: 'POST',
    body: JSON.stringify({
      id: session.id,
      userID: user.id,
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: {},
  });

  const deletedSession = await db.query.sessions.findFirst({
    where: (sessions, { eq }) => eq(sessions.id, session.id),
  });

  expect(deletedSession).toBeUndefined();

  await teardown();
});

test('it does not delete a session when userID does not match', async () => {
  const { app, db, teardown } = await setupTest();

  const user = await createTestUser({ db });

  const session = {
    id: 'test_session_id',
    userID: user.id,
    ipAddress: '127.0.0.1',
    refreshToken: 'test_refresh_token',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.insert(schema.sessions).values(session);

  const req = new Request('http://localhost/delete-session', {
    method: 'POST',
    body: JSON.stringify({
      id: session.id,
      userID: 'different_user_id',
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: {},
  });

  // verify session was not deleted
  const existingSession = await db.query.sessions.findFirst({
    where: (sessions, { eq }) => eq(sessions.id, session.id),
  });

  expect(existingSession).not.toBeNull();

  await teardown();
});

test('it handles invalid request body', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/delete-session', {
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
