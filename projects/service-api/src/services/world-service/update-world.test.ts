import { drop } from '@mswjs/data';
import { createTestJWT } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { ServiceID } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { updateWorld } from './update-world';

test('it updates a world', async () => {
  const user = db.user.create({});

  db.world.create({
    id: 'test_id',
    ownerID: user.id,
    name: 'Test World',
  });

  const accessToken = await createTestJWT({
    sub: user.id,
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
  });

  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceWorld,
    apiURL: env.WORLDS_SERVICE_URL,
    accessToken,
  });

  const args = {
    ownerID: user.id,
    worldID: 'test_id',
    name: 'Updated World',
  };

  const result = await updateWorld(args, ctx);

  expect(result).toMatchObject({
    id: 'test_id',
    ownerID: user.id,
    name: 'Updated World',
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
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  });

  drop(db);
});
