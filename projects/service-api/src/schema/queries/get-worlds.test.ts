import { createJWKSMock } from 'mock-jwks';
import { drop } from '@mswjs/data';
import { createTestAccessToken } from '@chrononomicon/service-test-utils';
import { env } from '../../env';
import { createMockGQLContext } from '../../test-utils';
import { server } from '../../mocks/node';
import { db } from '../../mocks/db';
import { getWorlds } from './get-worlds';

const jwks = createJWKSMock(`https://${env.AUTH0_DOMAIN}/`);

test('it returns all the worlds for the provided owner', async () => {
  server.use(jwks.mswHandler);

  db.world.create({
    id: 'test_id_1',
    ownerID: 'test_user_id',
    name: 'New World #1',
  });

  db.world.create({
    id: 'test_id_2',
    ownerID: 'test_user_id',
    name: 'New World #2',
  });

  const { accessToken } = createTestAccessToken({
    jwks,
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.AUTH0_DOMAIN}/`,
  });

  const ctx = createMockGQLContext({ accessToken });
  const args = { input: { worldID: 'test_id' } };
  const result = await getWorlds({}, args, ctx);

  expect(result).toIncludeAllMembers([
    {
      id: 'test_id_1',
      ownerID: 'test_user_id',
      name: 'New World #1',
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
    },
    {
      id: 'test_id_2',
      ownerID: 'test_user_id',
      name: 'New World #2',
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
    },
  ]);

  drop(db);
});

test('it returns an error if the user isnt authenticated', async () => {
  const ctx = createMockGQLContext({});
  const args = { input: { worldID: 'test_id' } };

  await expect(() => getWorlds({}, args, ctx)).rejects.toThrow('Unauthorized');
});
