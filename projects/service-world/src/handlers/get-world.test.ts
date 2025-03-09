import { worlds } from '@chrono/postgres-schema';
import { createTestUser, PostgresTestUtils } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { Hono } from 'hono';
import { pgTestConfig } from '../pg-test-config';
import { getWorld } from './get-world';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const user = await createTestUser({ db });

  app.post('/get-world', async (ctx) => getWorld(ctx, db));

  return { app, db, teardown, user };
}

test('it returns the requested world', async () => {
  const { app, db, teardown, user } = await setupTest();

  const worldID = createId();

  await db.insert(worlds).values({
    atmosphere: 'Neutral',
    fantasyType: 'Medium',
    geographyFeatures: ['Deserts'],
    geographyType: 'Supercontinent',
    id: worldID,
    name: 'New World',
    ownerID: user.id,
    population: 'Average',
    technologyLevel: 'Medieval',
  });

  const req = new Request('http://localhost/get-world', {
    body: JSON.stringify({
      ownerID: user.id,
      worldID: worldID,
    }),
    method: 'POST',
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    data: {
      atmosphere: 'Neutral',
      fantasyType: 'Medium',
      geographyFeatures: ['Deserts'],
      geographyType: 'Supercontinent',
      id: worldID,
      name: 'New World',
      ownerID: user.id,
      population: 'Average',
      technologyLevel: 'Medieval',
    },
    success: true,
  });

  await teardown();
});
