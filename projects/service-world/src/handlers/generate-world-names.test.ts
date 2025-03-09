import { worlds } from '@chrono/postgres-schema';
import { createTestUser, PostgresTestUtils } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { Hono } from 'hono';
import { pgTestConfig } from '../pg-test-config';
import { generateWorldNames } from './generate-world-names';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const user = await createTestUser({ db });

  app.post('/generate-world-names', async (ctx) => generateWorldNames(ctx, db));

  return { app, db, teardown, user };
}

test('it generates world names for the given world', async () => {
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

  const req = new Request('http://localhost/generate-world-names', {
    body: JSON.stringify({
      ownerID: user.id,
      worldID,
    }),
    method: 'POST',
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    data: ['Example World'],
    success: true,
  });

  await teardown();
});
