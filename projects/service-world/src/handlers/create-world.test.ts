import { createTestUser, PostgresTestUtils } from '@chrono/service-test-utils';
import { Hono } from 'hono';
import { pgTestConfig } from '../pg-test-config';
import { createWorld } from './create-world';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const user = await createTestUser({ db });

  app.post('/create-world', async (ctx) => createWorld(ctx, db));

  return { app, db, teardown, user };
}

test('it returns a new world with logical defaults', async () => {
  const { app, teardown, user } = await setupTest();

  const req = new Request('http://localhost/create-world', {
    body: JSON.stringify({
      ownerID: user.id,
    }),
    method: 'POST',
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    data: {
      archetype: null,
      atmosphere: 'Neutral',
      fantasyType: 'Medium',
      geographyFeatures: [
        'Deserts',
        'Forest',
        'Mountains',
        'Plains',
        'Swamps',
        'Tundra',
      ],
      geographyType: 'Supercontinent',
      id: expect.any(String),
      name: 'New World',
      ownerID: user.id,
      population: 'Average',
      technologyLevel: 'Medieval',
    },
    success: true,
  });

  await teardown();
});
