import { Hono } from 'hono';
import {
  PostgresTestUtils,
  createTestUser,
} from '@chrononomicon/service-test-utils';
import { createWorld } from './create-world';
import { pgTestConfig } from '../pg-test-config';
async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const { user } = await createTestUser({ db });

  app.post('/create-world', async (ctx) => createWorld(ctx, db));

  return { app, db, teardown, user };
}

afterEach(() => {
  vi.restoreAllMocks();
});

test('it returns a new world with logical defaults', async () => {
  const { app, teardown, user } = await setupTest();

  const req = new Request('http://localhost/create-world', {
    method: 'POST',
    body: JSON.stringify({
      ownerID: user.id,
    }),
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    success: true,
    data: {
      id: expect.any(String),
      ownerID: user.id,
      name: 'New World',
      fantasyType: 'Medium',
      technologyLevel: 'Medieval',
      archetype: null,
      atmosphere: 'Neutral',
      population: 'Average',
      geographyType: 'Supercontinent',
      geographyFeatures: [
        'Deserts',
        'Forest',
        'Mountains',
        'Plains',
        'Swamps',
        'Tundra',
      ],
    },
  });

  await teardown();
});
