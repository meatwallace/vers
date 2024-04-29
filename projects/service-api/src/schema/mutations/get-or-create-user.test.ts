import createJWKSMock from 'mock-jwks';
import { drop } from '@mswjs/data';
import { env } from '../../env';
import { createMockGQLContext } from '../../test-utils';
import { server } from '../../mocks/node';
import { db } from '../../mocks/db';
import { getOrCreateUser } from './get-or-create-user';

const jwks = createJWKSMock(`https://${env.AUTH0_DOMAIN}/`);

test('it returns an existing user', async () => {
  db.user.create({
    id: 'test_id',
    auth0ID: 'auth0|test_id',
    email: 'user@test.com',
    emailVerified: true,
    name: 'Test User',
    firstName: 'Test',
  });

  server.use(jwks.handler);

  const accessToken = jwks.token({
    sub: 'test_id',
    aud: env.API_IDENTIFIER,
    iss: `https://${env.AUTH0_DOMAIN}/`,
  });

  const ctx = createMockGQLContext({ accessToken });
  const args = { input: { email: 'user@test.com' } };
  const result = await getOrCreateUser({}, args, ctx);

  expect(result).toMatchObject({
    id: 'test_id',
    auth0ID: 'auth0|test_id',
    email: 'user@test.com',
    emailVerified: true,
    name: 'Test User',
    firstName: 'Test',
  });

  drop(db);
});
