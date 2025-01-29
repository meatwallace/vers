import { drop } from '@mswjs/data';
import { createTestJWT } from '@chrono/service-test-utils';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { resolve } from './get-worlds';

test('it returns all the worlds for the provided owner', async () => {
  const user = db.user.create({});

  db.world.create({
    id: 'test_id_1',
    ownerID: user.id,
    name: 'New World #1',
  });

  db.world.create({
    id: 'test_id_2',
    ownerID: user.id,
    name: 'New World #2',
  });

  const accessToken = await createTestJWT({
    sub: user.id,
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
  });

  const ctx = createMockGQLContext({ accessToken, user });
  const args = { input: {} };
  const result = await resolve({}, args, ctx);

  expect(result).toIncludeAllMembers([
    {
      id: 'test_id_1',
      ownerID: user.id,
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
      ownerID: user.id,
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
  const args = { input: {} };

  await expect(() => resolve({}, args, ctx)).rejects.toThrow('Unauthorized');
});
