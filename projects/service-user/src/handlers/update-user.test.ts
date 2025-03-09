import { users } from '@chrono/postgres-schema';
import { createTestUser, PostgresTestUtils } from '@chrono/service-test-utils';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { pgTestConfig } from '../pg-test-config';
import { updateUser } from './update-user';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const user = await createTestUser({ db });

  app.post('/update-user', async (ctx) => updateUser(ctx, db));

  return { app, db, teardown, user };
}

test('it updates the provided user', async () => {
  const { app, db, teardown, user } = await setupTest();

  const update = {
    email: 'updated@example.com',
    name: 'Updated Name',
    username: 'updated_username',
  };

  const req = new Request('http://localhost/update-user', {
    body: JSON.stringify({
      id: user.id,
      ...update,
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();
  const updatedUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: {
      updatedID: user.id,
    },
    success: true,
  });

  expect(updatedUser).toMatchObject({
    createdAt: expect.any(Date),
    email: 'updated@example.com',
    id: user.id,
    name: 'Updated Name',
    updatedAt: expect.any(Date),
    username: 'updated_username',
  });

  expect(updatedUser?.updatedAt.getTime()).toBeGreaterThan(
    user.updatedAt.getTime(),
  );

  await teardown();
});

test('it allows partial updating', async () => {
  const { app, db, teardown, user } = await setupTest();

  const update = {
    name: 'Updated Name',
  };

  const req = new Request('http://localhost/update-user', {
    body: JSON.stringify({
      id: user.id,
      ...update,
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();
  const updatedUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });

  expect(res.status).toBe(200);

  expect(body).toMatchObject({
    data: {
      updatedID: user.id,
    },
    success: true,
  });

  expect(updatedUser).toMatchObject({
    createdAt: expect.any(Date),
    email: user.email,
    id: user.id,
    name: 'Updated Name',
    updatedAt: expect.any(Date),
    username: user.username,
  });

  await teardown();
});
