import { Hono } from 'hono';
import { PostgresTestUtils, createTestUser } from '@chrono/service-test-utils';
import { users } from '@chrono/postgres-schema';
import { eq } from 'drizzle-orm';
import { updateUser } from './update-user';
import { pgTestConfig } from '../pg-test-config';

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
    name: 'Updated Name',
    username: 'updated_username',
    email: 'updated@example.com',
  };

  const req = new Request('http://localhost/update-user', {
    method: 'POST',
    body: JSON.stringify({
      id: user.id,
      ...update,
    }),
  });

  const res = await app.request(req);
  const body = await res.json();
  const updatedUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: {
      updatedID: user.id,
    },
  });

  expect(updatedUser).toMatchObject({
    id: user.id,
    name: 'Updated Name',
    username: 'updated_username',
    email: 'updated@example.com',
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
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
    method: 'POST',
    body: JSON.stringify({
      id: user.id,
      ...update,
    }),
  });

  const res = await app.request(req);
  const body = await res.json();
  const updatedUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });

  expect(res.status).toBe(200);

  expect(body).toMatchObject({
    success: true,
    data: {
      updatedID: user.id,
    },
  });

  expect(updatedUser).toMatchObject({
    id: user.id,
    name: 'Updated Name',
    username: user.username,
    email: user.email,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  });

  await teardown();
});
