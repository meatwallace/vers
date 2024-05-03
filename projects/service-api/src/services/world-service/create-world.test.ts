import { createJWKSMock } from 'mock-jwks';
import { drop } from '@mswjs/data';
import { createTestAccessToken } from '@chrononomicon/service-test-utils';
import { env } from '../../env';
import { server } from '../../mocks/node';
import { db } from '../../mocks/db';
import { createServiceContext } from '../utils';
import { createWorld } from './create-world';

const ISSUER = `https://${env.AUTH0_DOMAIN}/`;

const jwks = createJWKSMock(ISSUER);

test('it creates and returns a world', async () => {
  const user = db.user.create({
    id: 'test_id',
  });

  server.use(jwks.mswHandler);

  const { accessToken } = createTestAccessToken({
    jwks,
    audience: env.API_IDENTIFIER,
    issuer: ISSUER,
  });

  const ctx = createServiceContext({
    apiURL: env.WORLDS_SERVICE_URL,
    accessToken,
  });

  const args = { ownerID: 'test_id' };

  const result = await createWorld(args, ctx);

  expect(result).toMatchObject({
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
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  });

  drop(db);
});
