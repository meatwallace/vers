import { Hono } from 'hono';
import { PostgresTestUtils, createTestUser } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { worlds } from '@chrono/postgres-schema';
import { getWorlds } from './get-worlds';
import { pgTestConfig } from '../pg-test-config';
async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const user = await createTestUser({ db });

  app.post('/get-worlds', async (ctx) => getWorlds(ctx, db));

  return { app, db, teardown, user };
}

afterEach(() => {
  vi.restoreAllMocks();
});

test('it returns all the worlds for the given owner', async () => {
  const { app, db, teardown, user } = await setupTest();

  const worldID1 = createId();
  const worldID2 = createId();

  await db.insert(worlds).values({
    id: worldID1,
    ownerID: user.id,
    name: 'New World #1',
    fantasyType: 'Low',
    technologyLevel: 'Medieval',
    atmosphere: 'Dark',
    population: 'Sparse',
    geographyType: 'Supercontinent',
    geographyFeatures: ['Tundra'],
  });

  await db.insert(worlds).values({
    id: worldID2,
    ownerID: user.id,
    name: 'New World #2',
    fantasyType: 'High',
    technologyLevel: 'Medieval',
    atmosphere: 'Light',
    population: 'Average',
    geographyType: 'Islands',
    geographyFeatures: ['Deserts'],
  });

  const req = new Request('http://localhost/get-worlds', {
    method: 'POST',
    body: JSON.stringify({
      ownerID: user.id,
    }),
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    success: true,
    data: [
      {
        id: worldID1,
        ownerID: user.id,
        name: 'New World #1',
        fantasyType: 'Low',
        technologyLevel: 'Medieval',
        atmosphere: 'Dark',
        population: 'Sparse',
        geographyType: 'Supercontinent',
        geographyFeatures: ['Tundra'],
      },
      {
        id: worldID2,
        ownerID: user.id,
        name: 'New World #2',
        fantasyType: 'High',
        technologyLevel: 'Medieval',
        atmosphere: 'Light',
        population: 'Average',
        geographyType: 'Islands',
        geographyFeatures: ['Deserts'],
      },
    ],
  });

  await teardown();
});

test('it returns an empty array if the owner does not have any worlds', async () => {
  const { app, teardown, user } = await setupTest();

  const req = new Request('http://localhost/get-worlds', {
    method: 'POST',
    body: JSON.stringify({
      ownerID: user.id,
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
