import { drop } from '@mswjs/data';
import { createTestJWT } from '@chrono/service-test-utils';
import { env } from '~/env';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { db } from '~/mocks/db';
import { resolve } from './get-world';

test('it returns the requested world', async () => {
  const user = db.user.create({});

  db.world.create({
    id: 'test_id',
    ownerID: user.id,
  });

  const accessToken = await createTestJWT({
    sub: user.id,
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
  });

  const ctx = createMockGQLContext({ accessToken, user });
  const args = { input: { worldID: 'test_id' } };
  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    id: 'test_id',
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

test('it returns an error if the user isnt authenticated', async () => {
  const ctx = createMockGQLContext({});
  const args = { input: { worldID: 'test_id' } };

  await expect(() => resolve({}, args, ctx)).rejects.toThrow('Unauthorized');
});
