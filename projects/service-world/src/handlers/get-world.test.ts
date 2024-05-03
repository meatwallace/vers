import { Hono } from 'hono';
import {
  PostgresTestUtils,
  createTestUser,
} from '@chrononomicon/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { worlds } from '@chrononomicon/postgres-schema';
import { getWorld } from './get-world';
import { pgTestConfig } from '../pg-test-config';
async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const { user } = await createTestUser({ db });

  app.post('/get-world', async (ctx) => getWorld(ctx, db));

  return { app, db, teardown, user };
}

afterEach(() => {
  vi.restoreAllMocks();
});

test('it returns the requested world', async () => {
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

  const req = new Request('http://localhost/get-world', {
    method: 'POST',
    body: JSON.stringify({
      ownerID: user.id,
      worldID: worldID,
    }),
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    success: true,
    data: {
      id: worldID,
      ownerID: user.id,
      name: 'New World',
      fantasyType: 'Medium',
      technologyLevel: 'Medieval',
      atmosphere: 'Neutral',
      population: 'Average',
      geographyType: 'Supercontinent',
      geographyFeatures: ['Deserts'],
    },
  });

  await teardown();
});
