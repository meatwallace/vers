import { Hono } from 'hono';
import { PostgresTestUtils, createTestUser } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { worlds } from '@chrono/postgres-schema';
import { and, eq } from 'drizzle-orm';
import { updateWorld } from './update-world';
import { pgTestConfig } from '../pg-test-config';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const user = await createTestUser({ db });

  app.post('/update-world', async (ctx) => updateWorld(ctx, db));

  return { app, db, teardown, user };
}

afterEach(() => {
  vi.restoreAllMocks();
});

type UpdateWorldSuccessResponse = {
  success: true;
  data: typeof worlds.$inferSelect;
};

test('it updates the provided world', async () => {
  const { app, db, teardown, user } = await setupTest();

  const worldID = createId();

  const [insertedWorld] = await db
    .insert(worlds)
    .values({
      id: worldID,
      ownerID: user.id,
      name: 'New World',
      fantasyType: 'Medium',
      technologyLevel: 'Medieval',
      atmosphere: 'Neutral',
      population: 'Average',
      geographyType: 'Supercontinent',
      geographyFeatures: ['Deserts'],
      createdAt: new Date('2024-05-02T01:58:38.835Z'),
    })
    .returning();

  const update = {
    name: 'Updated World',
    fantasyType: 'High',
    technologyLevel: 'Modern',
    archetype: 'Cyberpunk',
    atmosphere: 'Dark',
    population: 'Dense',
    geographyType: 'Continents',
    geographyFeatures: ['Tundra'],
  };

  const req = new Request('http://localhost/update-world', {
    method: 'POST',
    body: JSON.stringify({
      ownerID: user.id,
      worldID: worldID,
      ...update,
    }),
  });

  const res = await app.request(req);

  const returnedData = (await res.json()) as UpdateWorldSuccessResponse;

  const persistedWorld = await db.query.worlds.findFirst({
    where: and(eq(worlds.ownerID, user.id), eq(worlds.id, worldID)),
  });

  expect(res.status).toBe(200);

  expect(returnedData).toMatchObject({
    success: true,
    data: {
      id: worldID,
      ownerID: user.id,
      name: 'Updated World',
      fantasyType: 'High',
      technologyLevel: 'Modern',
      archetype: 'Cyberpunk',
      atmosphere: 'Dark',
      population: 'Dense',
      geographyType: 'Continents',
      geographyFeatures: ['Tundra'],
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  });

  expect(new Date(returnedData.data.updatedAt).getTime()).toBeGreaterThan(
    insertedWorld.updatedAt.getTime(),
  );

  expect(persistedWorld).toMatchObject({
    id: worldID,
    ownerID: user.id,
    name: 'Updated World',
    fantasyType: 'High',
    technologyLevel: 'Modern',
    atmosphere: 'Dark',
    population: 'Dense',
    geographyType: 'Continents',
    geographyFeatures: ['Tundra'],
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  });

  expect(persistedWorld?.updatedAt.getTime()).toBeGreaterThan(
    insertedWorld.updatedAt.getTime(),
  );

  await teardown();
});

test('it allows partial updating', async () => {
  const { app, db, teardown, user } = await setupTest();

  const worldID = createId();

  await db
    .insert(worlds)
    .values({
      id: worldID,
      ownerID: user.id,
      name: 'New World',
      fantasyType: 'Medium',
      technologyLevel: 'Medieval',
      atmosphere: 'Neutral',
      population: 'Average',
      geographyType: 'Supercontinent',
      geographyFeatures: ['Deserts'],
      createdAt: new Date('2024-05-02T01:58:38.835Z'),
    })
    .returning();

  const update = {
    name: 'Updated World',
  };

  const req = new Request('http://localhost/update-world', {
    method: 'POST',
    body: JSON.stringify({
      ownerID: user.id,
      worldID: worldID,
      ...update,
    }),
  });

  const res = await app.request(req);

  const returnedData = (await res.json()) as UpdateWorldSuccessResponse;

  const persistedWorld = await db.query.worlds.findFirst({
    where: and(eq(worlds.ownerID, user.id), eq(worlds.id, worldID)),
  });

  expect(res.status).toBe(200);

  expect(returnedData).toMatchObject({
    success: true,
    data: {
      id: worldID,
      ownerID: user.id,
      name: 'Updated World',
      fantasyType: 'Medium',
      technologyLevel: 'Medieval',
      atmosphere: 'Neutral',
      population: 'Average',
      geographyType: 'Supercontinent',
      geographyFeatures: ['Deserts'],
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  });

  expect(persistedWorld).toMatchObject({
    id: worldID,
    ownerID: user.id,
    name: 'Updated World',
    fantasyType: 'Medium',
    technologyLevel: 'Medieval',
    atmosphere: 'Neutral',
    population: 'Average',
    geographyType: 'Supercontinent',
    geographyFeatures: ['Deserts'],
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  });

  await teardown();
});
