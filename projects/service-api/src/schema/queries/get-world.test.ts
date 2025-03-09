import { createTestJWT } from '@chrono/service-test-utils';
import { drop } from '@mswjs/data';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { resolve } from './get-world';

test('it returns the requested world', async () => {
  const user = db.user.create({});

  db.world.create({
    id: 'test_id',
    ownerID: user.id,
  });

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
    sub: user.id,
  });

  const ctx = createMockGQLContext({ accessToken, user });
  const args = { input: { worldID: 'test_id' } };
  const result = await resolve({}, args, ctx);

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
    name: 'New World',
    ownerID: user.id,
    population: 'Average',
    technologyLevel: 'Medieval',
    updatedAt: expect.any(Date),
  });

  drop(db);
});

test('it returns an error if the user isnt authenticated', async () => {
  const ctx = createMockGQLContext({});
  const args = { input: { worldID: 'test_id' } };

  await expect(() => resolve({}, args, ctx)).rejects.toThrow('Unauthorized');
});
