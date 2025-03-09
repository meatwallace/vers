import { Hono } from 'hono';
import { PostgresTestUtils, createTestUser } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { sessions } from '@chrono/postgres-schema';
import { getSessions } from './get-sessions';
import { pgTestConfig } from '../pg-test-config';

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
      id: sessionID1,
      userID: user.id,
      ipAddress: '127.0.0.1',
      refreshToken: 'refresh-token-1',
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: sessionID2,
      userID: user.id,
      ipAddress: '127.0.0.2',
      refreshToken: 'refresh-token-2',
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      createdAt: now,
      updatedAt: now,
    },
  ]);

  const req = new Request('http://localhost/get-sessions', {
    method: 'POST',
    body: JSON.stringify({
      userID: user.id,
    }),
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    success: true,
    data: [
      {
        id: sessionID1,
        userID: user.id,
        ipAddress: '127.0.0.1',
        refreshToken: 'refresh-token-1',
        expiresAt: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      {
        id: sessionID2,
        userID: user.id,
        ipAddress: '127.0.0.2',
        refreshToken: 'refresh-token-2',
        expiresAt: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    ],
  });

  await teardown();
});

test('it returns an empty array if the user has no sessions', async () => {
  const { app, teardown, user } = await setupTest();

  const req = new Request('http://localhost/get-sessions', {
    method: 'POST',
    body: JSON.stringify({
      userID: user.id,
    }),
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    success: true,
    data: [],
  });

  await teardown();
});
