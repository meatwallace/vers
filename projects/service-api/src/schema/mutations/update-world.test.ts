import { createTestJWT } from '@chrono/service-test-utils';
import { drop } from '@mswjs/data';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { resolve } from './update-world';

test('it updates a world', async () => {
  const user = db.user.create({});

  db.world.create({
    atmosphere: 'Neutral',
    fantasyType: 'Medium',
    geographyFeatures: ['Deserts'],
    geographyType: 'Supercontinent',
    id: 'test_id',
    name: 'New World',
    population: 'Average',
    technologyLevel: 'Medieval',
  });

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
    sub: user.id,
  });

  const ctx = createMockGQLContext({ accessToken, user });

  const args = {
    input: {
      atmosphere: 'Dark',
      fantasyType: 'High',
      geographyFeatures: ['Tundra'],
      geographyType: 'Continents',
      name: 'Updated World',
      population: 'Dense',
      technologyLevel: 'Modern',
      worldID: 'test_id',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    atmosphere: 'Dark',
    fantasyType: 'High',
    geographyFeatures: ['Tundra'],
    geographyType: 'Continents',
    id: 'test_id',
    name: 'Updated World',
    population: 'Dense',
    technologyLevel: 'Modern',
  });

  drop(db);
});

test('it supports partial updates', async () => {
  const user = db.user.create({});

  db.world.create({
    atmosphere: 'Neutral',
    fantasyType: 'Medium',
    geographyFeatures: ['Deserts'],
    geographyType: 'Supercontinent',
    id: 'test_id',
    name: 'New World',
    ownerID: user.id,
    population: 'Average',
    technologyLevel: 'Medieval',
  });

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
    sub: user.id,
  });

  const ctx = createMockGQLContext({ accessToken, user });

  const args = {
    input: {
      name: 'Updated World',
      worldID: 'test_id',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    atmosphere: 'Neutral',
    fantasyType: 'Medium',
    geographyFeatures: ['Deserts'],
    geographyType: 'Supercontinent',
    id: 'test_id',
    name: 'Updated World',
    population: 'Average',
    technologyLevel: 'Medieval',
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
