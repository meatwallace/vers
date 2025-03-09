import { expect, test } from 'vitest';
import * as schema from '@vers/postgres-schema';
import { createTestUser, PostgresTestUtils } from '@vers/service-test-utils';
import { Hono } from 'hono';
import { pgTestConfig } from '../pg-test-config';
import { deleteSession } from './delete-session';

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
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    id: 'test_session_id',
    ipAddress: '127.0.0.1',
    refreshToken: 'test_refresh_token',
    updatedAt: new Date(),
    userID: user.id,
  };

  await db.insert(schema.sessions).values(session);

  const req = new Request('http://localhost/delete-session', {
    body: JSON.stringify({
      id: session.id,
      userID: user.id,
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: {},
    success: true,
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
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    id: 'test_session_id',
    ipAddress: '127.0.0.1',
    refreshToken: 'test_refresh_token',
    updatedAt: new Date(),
    userID: user.id,
  };

  await db.insert(schema.sessions).values(session);

  const req = new Request('http://localhost/delete-session', {
    body: JSON.stringify({
      id: session.id,
      userID: 'different_user_id',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: {},
    success: true,
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
