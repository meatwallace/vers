import { worlds } from '@chrono/postgres-schema';
import { createTestUser, PostgresTestUtils } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { Hono } from 'hono';
import { pgTestConfig } from '../pg-test-config';
import { getWorlds } from './get-worlds';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const user = await createTestUser({ db });

  app.post('/get-worlds', async (ctx) => getWorlds(ctx, db));

  return { app, db, teardown, user };
}

test('it returns all the worlds for the given owner', async () => {
  const { app, db, teardown, user } = await setupTest();

  const worldID1 = createId();
  const worldID2 = createId();

  await db.insert(worlds).values({
    atmosphere: 'Dark',
    fantasyType: 'Low',
    geographyFeatures: ['Tundra'],
    geographyType: 'Supercontinent',
    id: worldID1,
    name: 'New World #1',
    ownerID: user.id,
    population: 'Sparse',
    technologyLevel: 'Medieval',
  });

  await db.insert(worlds).values({
    atmosphere: 'Light',
    fantasyType: 'High',
    geographyFeatures: ['Deserts'],
    geographyType: 'Islands',
    id: worldID2,
    name: 'New World #2',
    ownerID: user.id,
    population: 'Average',
    technologyLevel: 'Medieval',
  });

  const req = new Request('http://localhost/get-worlds', {
    body: JSON.stringify({
      ownerID: user.id,
    }),
    method: 'POST',
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    data: [
      {
        atmosphere: 'Dark',
        fantasyType: 'Low',
        geographyFeatures: ['Tundra'],
        geographyType: 'Supercontinent',
        id: worldID1,
        name: 'New World #1',
        ownerID: user.id,
        population: 'Sparse',
        technologyLevel: 'Medieval',
      },
      {
        atmosphere: 'Light',
        fantasyType: 'High',
        geographyFeatures: ['Deserts'],
        geographyType: 'Islands',
        id: worldID2,
        name: 'New World #2',
        ownerID: user.id,
        population: 'Average',
        technologyLevel: 'Medieval',
      },
    ],
    success: true,
  });

  await teardown();
});

test('it returns an empty array if the owner does not have any worlds', async () => {
  const { app, teardown, user } = await setupTest();

  const req = new Request('http://localhost/get-worlds', {
    body: JSON.stringify({
      ownerID: user.id,
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
