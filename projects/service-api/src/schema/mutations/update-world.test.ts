import { drop } from '@mswjs/data';
import { createTestJWT } from '@chrono/service-test-utils';
import { env } from '~/env';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { db } from '~/mocks/db';
import { resolve } from './update-world';

test('it updates a world', async () => {
  const user = db.user.create({});

  db.world.create({
    id: 'test_id',
    name: 'New World',
    fantasyType: 'Medium',
    technologyLevel: 'Medieval',
    atmosphere: 'Neutral',
    population: 'Average',
    geographyType: 'Supercontinent',
    geographyFeatures: ['Deserts'],
  });

  const accessToken = await createTestJWT({
    sub: user.id,
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
  });

  const ctx = createMockGQLContext({ accessToken, user });

  const args = {
    input: {
      worldID: 'test_id',
      name: 'Updated World',
      fantasyType: 'High',
      technologyLevel: 'Modern',
      atmosphere: 'Dark',
      population: 'Dense',
      geographyType: 'Continents',
      geographyFeatures: ['Tundra'],
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    id: 'test_id',
    name: 'Updated World',
    fantasyType: 'High',
    technologyLevel: 'Modern',
    atmosphere: 'Dark',
    population: 'Dense',
    geographyType: 'Continents',
    geographyFeatures: ['Tundra'],
  });

  drop(db);
});

test('it supports partial updates', async () => {
  const user = db.user.create({});

  db.world.create({
    id: 'test_id',
    ownerID: user.id,
    name: 'New World',
    fantasyType: 'Medium',
    technologyLevel: 'Medieval',
    atmosphere: 'Neutral',
    population: 'Average',
    geographyType: 'Supercontinent',
    geographyFeatures: ['Deserts'],
  });

  const accessToken = await createTestJWT({
    sub: user.id,
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
  });

  const ctx = createMockGQLContext({ accessToken, user });

  const args = {
    input: {
      worldID: 'test_id',
      name: 'Updated World',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    id: 'test_id',
    name: 'Updated World',
    fantasyType: 'Medium',
    technologyLevel: 'Medieval',
    atmosphere: 'Neutral',
    population: 'Average',
    geographyType: 'Supercontinent',
    geographyFeatures: ['Deserts'],
  });

  drop(db);
});

test('it returns an error if the user isnt authenticated', async () => {
  const ctx = createMockGQLContext({});
  const args = {
    input: {
      worldID: 'test_id',
    },
  };

  await expect(() => resolve({}, args, ctx)).rejects.toThrow('Unauthorized');
});
