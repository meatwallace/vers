import { sessions } from '@chrono/postgres-schema';
import { createTestUser, PostgresTestUtils } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { Hono } from 'hono';
import { pgTestConfig } from '../pg-test-config';
import { getSessions } from './get-sessions';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const user = await createTestUser({ db });

  app.post('/get-sessions', async (ctx) => getSessions(ctx, db));

  return { app, db, teardown, user };
}

test('it returns all sessions for the user', async () => {
  const { app, db, teardown, user } = await setupTest();

  const now = new Date();
  const sessionID1 = createId();
  const sessionID2 = createId();

  await db.insert(sessions).values([
    {
      createdAt: now,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      id: sessionID1,
      ipAddress: '127.0.0.1',
      refreshToken: 'refresh-token-1',
      updatedAt: now,
      userID: user.id,
    },
    {
      createdAt: now,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      id: sessionID2,
      ipAddress: '127.0.0.2',
      refreshToken: 'refresh-token-2',
      updatedAt: now,
      userID: user.id,
    },
  ]);

  const req = new Request('http://localhost/get-sessions', {
    body: JSON.stringify({
      userID: user.id,
    }),
    method: 'POST',
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    data: [
      {
        createdAt: expect.any(String),
        expiresAt: expect.any(String),
        id: sessionID1,
        ipAddress: '127.0.0.1',
        refreshToken: 'refresh-token-1',
        updatedAt: expect.any(String),
        userID: user.id,
      },
      {
        createdAt: expect.any(String),
        expiresAt: expect.any(String),
        id: sessionID2,
        ipAddress: '127.0.0.2',
        refreshToken: 'refresh-token-2',
        updatedAt: expect.any(String),
        userID: user.id,
      },
    ],
    success: true,
  });

  await teardown();
});

test('it returns an empty array if the user has no sessions', async () => {
  const { app, teardown, user } = await setupTest();

  const req = new Request('http://localhost/get-sessions', {
    body: JSON.stringify({
      userID: user.id,
    }),
    method: 'POST',
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    data: [],
    success: true,
  });

  await teardown();
});
