import { createId } from '@paralleldrive/cuid2';
import { sessions } from '@vers/postgres-schema';
import { createTestUser, PostgresTestUtils } from '@vers/service-test-utils';
import { Hono } from 'hono';
import { pgTestConfig } from '../pg-test-config';
import { getSession } from './get-session';

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
    createdAt: now,
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours from now
    id: sessionID,
    ipAddress: '127.0.0.1',
    refreshToken: createId(),
    updatedAt: now,
    userID: user.id,
  });

  const req = new Request('http://localhost/get-session', {
    body: JSON.stringify({
      id: sessionID,
    }),
    method: 'POST',
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    data: {
      createdAt: expect.any(String),
      expiresAt: expect.any(String),
      id: sessionID,
      ipAddress: '127.0.0.1',
      updatedAt: expect.any(String),
      userID: user.id,
    },
    success: true,
  });

  await teardown();
});
