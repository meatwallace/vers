import createJWKSMock from 'mock-jwks';
import { drop } from '@mswjs/data';
import { createTestAccessToken } from '@chrononomicon/service-test-utils';
import { env } from '../../env';
import { createMockGQLContext } from '../../test-utils';
import { db } from '../../mocks/db';
import { updateWorld } from './update-world';

const jwks = createJWKSMock(`https://${env.AUTH0_DOMAIN}/`);

test('it updates a world', async () => {
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

  const { accessToken } = createTestAccessToken({
    jwks,
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.AUTH0_DOMAIN}/`,
  });

  const ctx = createMockGQLContext({ accessToken });

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

  const result = await updateWorld({}, args, ctx);

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

  const { accessToken } = createTestAccessToken({
    jwks,
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.AUTH0_DOMAIN}/`,
  });

  const ctx = createMockGQLContext({ accessToken });

  const args = {
    input: {
      worldID: 'test_id',
      name: 'Updated World',
    },
  };

  const result = await updateWorld({}, args, ctx);

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

  const result = await updateWorld({}, args, ctx);

  expect(result).toMatchObject({
    error: {
      title: 'Unauthorized',
      message: 'You must be logged in to perform this action',
    },
  });
});
