import { Hono } from 'hono';
import { PostgresTestUtils, createTestUser } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { sessions } from '@chrono/postgres-schema';
import { getSession } from './get-session';
import { pgTestConfig } from '../pg-test-config';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const user = await createTestUser({ db });

  app.post('/get-session', async (ctx) => getSession(ctx, db));

  return { app, db, teardown, user };
}

test('it returns the requested session', async () => {
  const { app, db, teardown, user } = await setupTest();

  const sessionID = createId();
  const now = new Date();

  await db.insert(sessions).values({
    id: sessionID,
    userID: user.id,
    ipAddress: '127.0.0.1',
    refreshToken: createId(),
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours from now
    createdAt: now,
    updatedAt: now,
  });

  const req = new Request('http://localhost/get-session', {
    method: 'POST',
    body: JSON.stringify({
      id: sessionID,
    }),
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    success: true,
    data: {
      id: sessionID,
      userID: user.id,
      ipAddress: '127.0.0.1',
      expiresAt: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  });

  await teardown();
});
