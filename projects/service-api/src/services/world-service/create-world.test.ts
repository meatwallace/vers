import { createTestJWT } from '@chrono/service-test-utils';
import { ServiceID } from '@chrono/service-types';
import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { env } from '../../env';
import { db } from '../../mocks/db';
import { createServiceContext } from '../utils';
import { createWorld } from './create-world';

test('it creates and returns a world', async () => {
  const user = db.user.create({});

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

  const args = { ownerID: user.id };

  const result = await createWorld(args, ctx);

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
    id: expect.any(String),
    name: 'New World',
    ownerID: user.id,
    population: 'Average',
    technologyLevel: 'Medieval',
    updatedAt: expect.any(Date),
  });

  drop(db);
});
