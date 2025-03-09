import { worlds } from '@chrono/postgres-schema';
import { createTestUser, PostgresTestUtils } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { pgTestConfig } from '../pg-test-config';
import { updateWorld } from './update-world';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const user = await createTestUser({ db });

  app.post('/update-world', async (ctx) => updateWorld(ctx, db));

  return { app, db, teardown, user };
}

test('it updates the provided world', async () => {
  const { app, db, teardown, user } = await setupTest();

  const worldID = createId();

  const [insertedWorld] = await db
    .insert(worlds)
    .values({
      atmosphere: 'Neutral',
      createdAt: new Date('2024-05-02T01:58:38.835Z'),
      fantasyType: 'Medium',
      geographyFeatures: ['Deserts'],
      geographyType: 'Supercontinent',
      id: worldID,
      name: 'New World',
      ownerID: user.id,
      population: 'Average',
      technologyLevel: 'Medieval',
    })
    .returning();

  const update = {
    archetype: 'Cyberpunk',
    atmosphere: 'Dark',
    fantasyType: 'High',
    geographyFeatures: ['Tundra'],
    geographyType: 'Continents',
    name: 'Updated World',
    population: 'Dense',
    technologyLevel: 'Modern',
  };

  const req = new Request('http://localhost/update-world', {
    body: JSON.stringify({
      ownerID: user.id,
      worldID: worldID,
      ...update,
    }),
    method: 'POST',
  });

  const res = await app.request(req);

  const body = await res.json();

  const updatedWorld = await db.query.worlds.findFirst({
    where: and(eq(worlds.ownerID, user.id), eq(worlds.id, worldID)),
  });

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: {
      archetype: 'Cyberpunk',
      atmosphere: 'Dark',
      createdAt: expect.any(String),
      fantasyType: 'High',
      geographyFeatures: ['Tundra'],
      geographyType: 'Continents',
      id: worldID,
      name: 'Updated World',
      ownerID: user.id,
      population: 'Dense',
      technologyLevel: 'Modern',
      updatedAt: expect.any(String),
    },
    success: true,
  });

  expect(updatedWorld).toMatchObject({
    atmosphere: 'Dark',
    createdAt: expect.any(Date),
    fantasyType: 'High',
    geographyFeatures: ['Tundra'],
    geographyType: 'Continents',
    id: worldID,
    name: 'Updated World',
    ownerID: user.id,
    population: 'Dense',
    technologyLevel: 'Modern',
    updatedAt: expect.any(Date),
  });

  expect(updatedWorld?.updatedAt.getTime()).toBeGreaterThan(
    insertedWorld.updatedAt.getTime(),
  );

  await teardown();
});

test('it allows partial updating', async () => {
  const { app, db, teardown, user } = await setupTest();

  const worldID = createId();

  await db.insert(worlds).values({
    atmosphere: 'Neutral',
    createdAt: new Date('2024-05-02T01:58:38.835Z'),
    fantasyType: 'Medium',
    geographyFeatures: ['Deserts'],
    geographyType: 'Supercontinent',
    id: worldID,
    name: 'New World',
    ownerID: user.id,
    population: 'Average',
    technologyLevel: 'Medieval',
  });

  const update = {
    name: 'Updated World',
  };

  const req = new Request('http://localhost/update-world', {
    body: JSON.stringify({
      ownerID: user.id,
      worldID: worldID,
      ...update,
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();
  const updatedWorld = await db.query.worlds.findFirst({
    where: and(eq(worlds.ownerID, user.id), eq(worlds.id, worldID)),
  });

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: {
      atmosphere: 'Neutral',
      createdAt: expect.any(String),
      fantasyType: 'Medium',
      geographyFeatures: ['Deserts'],
      geographyType: 'Supercontinent',
      id: worldID,
      name: 'Updated World',
      ownerID: user.id,
      population: 'Average',
      technologyLevel: 'Medieval',
      updatedAt: expect.any(String),
    },
    success: true,
  });

  expect(updatedWorld).toMatchObject({
    atmosphere: 'Neutral',
    createdAt: expect.any(Date),
    fantasyType: 'Medium',
    geographyFeatures: ['Deserts'],
    geographyType: 'Supercontinent',
    id: worldID,
    name: 'Updated World',
    ownerID: user.id,
    population: 'Average',
    technologyLevel: 'Medieval',
    updatedAt: expect.any(Date),
  });

  await teardown();
});
