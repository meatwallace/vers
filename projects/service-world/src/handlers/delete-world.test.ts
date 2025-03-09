import { Hono } from 'hono';
import { PostgresTestUtils, createTestUser } from '@chrono/service-test-utils';
import { worlds } from '@chrono/postgres-schema';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { deleteWorld } from './delete-world';
import { pgTestConfig } from '../pg-test-config';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const user = await createTestUser({ db });

  app.post('/delete-world', async (ctx) => deleteWorld(ctx, db));

  return { app, db, teardown, user };
}

test('it deletes the given world', async () => {
  const { app, db, teardown, user } = await setupTest();

  const worldID = createId();

  await db.insert(worlds).values({
    id: worldID,
    ownerID: user.id,
    name: 'New World',
    fantasyType: 'Medium',
    technologyLevel: 'Medieval',
    atmosphere: 'Neutral',
    population: 'Average',
    geographyType: 'Supercontinent',
    geographyFeatures: ['Deserts'],
  });

  const req = new Request('http://localhost/delete-world', {
    method: 'POST',
    body: JSON.stringify({
      worldID,
      ownerID: user.id,
    }),
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    success: true,
    data: {
      deletedID: worldID,
    },
  });

  const deletedWorld = await db.query.worlds.findFirst({
    where: eq(worlds.id, worldID),
  });

  expect(deletedWorld).toBeUndefined();

  await teardown();
});
