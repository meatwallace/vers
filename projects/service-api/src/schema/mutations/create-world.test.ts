import { drop } from '@mswjs/data';
import { createTestJWT } from '@chrono/service-test-utils';
import { env } from '~/env';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { db } from '~/mocks/db';
import { resolve } from './create-world';

test('it creates a new world', async () => {
  const user = db.user.create({});

  const accessToken = await createTestJWT({
    sub: user.id,
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
  });

  const ctx = createMockGQLContext({ accessToken, user });

  const args = { input: {} };
  const result = await resolve({}, args, ctx);

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

test('it returns an error if the user isnt authenticated', async () => {
  const ctx = createMockGQLContext({});
  const args = { input: {} };

  await expect(() => resolve({}, args, ctx)).rejects.toThrow('Unauthorized');
});
