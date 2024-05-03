import { createJWKSMock } from 'mock-jwks';
import { drop } from '@mswjs/data';
import { createTestAccessToken } from '@chrononomicon/service-test-utils';
import { env } from '../../env';
import { createMockGQLContext } from '../../test-utils';
import { server } from '../../mocks/node';
import { db } from '../../mocks/db';
import { deleteWorld } from './delete-world';

const jwks = createJWKSMock(`https://${env.AUTH0_DOMAIN}/`);

test('it deletes a world', async () => {
  server.use(jwks.mswHandler);

  db.world.create({
    id: 'test_id',
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
    },
  };

  const result = await deleteWorld({}, args, ctx);

  expect(result).toMatchObject({
    success: true,
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

  const result = await deleteWorld({}, args, ctx);

  expect(result).toMatchObject({
    error: {
      title: 'Unauthorized',
      message: 'You must be logged in to perform this action',
    },
  });
});
