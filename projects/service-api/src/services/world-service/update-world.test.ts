import { createTestJWT } from '@chrono/service-test-utils';
import { ServiceID } from '@chrono/service-types';
import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { updateWorld } from './update-world';

test('it updates a world', async () => {
  const user = db.user.create({});

  db.world.create({
    id: 'test_id',
    name: 'Test World',
    ownerID: user.id,
  });

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
    sub: user.id,
  });

  const ctx = createServiceContext({
    accessToken,
    apiURL: env.WORLDS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceWorld,
  });

  const args = {
    name: 'Updated World',
    ownerID: user.id,
    worldID: 'test_id',
  };

  const result = await updateWorld(args, ctx);

  expect(result).toMatchObject({
    archetype: null,
    atmosphere: 'Neutral',
    createdAt: expect.any(Date),
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
    id: 'test_id',
    name: 'Updated World',
    ownerID: user.id,
    population: 'Average',
    technologyLevel: 'Medieval',
    updatedAt: expect.any(Date),
  });

  drop(db);
});
