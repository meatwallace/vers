import { createJWKSMock } from 'mock-jwks';
import { drop } from '@mswjs/data';
import { createTestAccessToken } from '@chrononomicon/service-test-utils';
import { env } from '../../env';
import { createMockGQLContext } from '../../test-utils';
import { server } from '../../mocks/node';
import { db } from '../../mocks/db';
import { createWorld } from './create-world';

const jwks = createJWKSMock(`https://${env.AUTH0_DOMAIN}/`);

test('it creates a new world', async () => {
  server.use(jwks.mswHandler);

  const { accessToken } = createTestAccessToken({
    jwks,
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.AUTH0_DOMAIN}/`,
  });

  const ctx = createMockGQLContext({ accessToken });

  db.user.create({
    id: ctx.user?.id,
  });

  const args = { input: {} };
  const result = await createWorld({}, args, ctx);

  expect(result).toMatchObject({
    id: expect.any(String),
    ownerID: 'test_user_id',
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
  const result = await createWorld({}, args, ctx);

  expect(result).toMatchObject({
    error: {
      title: 'Unauthorized',
      message: 'You must be logged in to perform this action',
    },
  });
});
