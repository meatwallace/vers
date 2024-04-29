import createJWKSMock from 'mock-jwks';
import { env } from '../../env';
import { createMockGQLContext } from '../../test-utils';
import { getCurrentUser } from './get-current-user';
import { server } from '../../mocks/node';
import { db } from '../../mocks/db';
import { drop } from '@mswjs/data';

const jwks = createJWKSMock(`https://${env.AUTH0_DOMAIN}/`);

test('it returns the current user', async () => {
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
  const result = await getCurrentUser({}, {}, ctx);

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
