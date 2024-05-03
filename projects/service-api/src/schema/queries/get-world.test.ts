import { createJWKSMock } from 'mock-jwks';
import { drop } from '@mswjs/data';
import { createTestAccessToken } from '@chrononomicon/service-test-utils';
import { env } from '../../env';
import { createMockGQLContext } from '../../test-utils';
import { server } from '../../mocks/node';
import { db } from '../../mocks/db';
import { getWorld } from './get-world';

const jwks = createJWKSMock(`https://${env.AUTH0_DOMAIN}/`);

test('it returns the requested world', async () => {
  server.use(jwks.mswHandler);

  db.world.create({
    id: 'test_id',
    ownerID: 'test_owner_id',
  });

  const { accessToken } = createTestAccessToken({
    jwks,
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.AUTH0_DOMAIN}/`,
  });

  const ctx = createMockGQLContext({ accessToken });
  const args = { input: { worldID: 'test_id' } };
  const result = await getWorld({}, args, ctx);

  expect(result).toMatchObject({
    id: 'test_id',
    ownerID: 'test_owner_id',
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

test('it returns an error if the user isnt authenticated', async () => {
  const ctx = createMockGQLContext({});
  const args = { input: { worldID: 'test_id' } };

  await expect(() => getWorld({}, args, ctx)).rejects.toThrow('Unauthorized');
});
