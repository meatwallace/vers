import { createJWKSMock } from 'mock-jwks';
import { drop } from '@mswjs/data';
import { createTestAccessToken } from '@chrononomicon/service-test-utils';
import { env } from '../../env';
import { server } from '../../mocks/node';
import { db } from '../../mocks/db';
import { createServiceContext } from '../utils';
import { getCurrentUser } from './get-current-user';

const ISSUER = `https://${env.AUTH0_DOMAIN}/`;

const jwks = createJWKSMock(ISSUER);

test('it returns the current user', async () => {
  db.user.create({
    id: 'test_id',
    auth0ID: 'auth0|test_id',
    email: 'user@test.com',
    emailVerified: true,
    name: 'Test User',
    firstName: 'Test',
  });

  server.use(jwks.mswHandler);

  const { accessToken } = createTestAccessToken({
    jwks,
    audience: env.API_IDENTIFIER,
    issuer: ISSUER,
  });

  const ctx = createServiceContext({
    apiURL: env.USERS_SERVICE_URL,
    accessToken,
  });

  const args = { email: 'user@test.com' };
  const result = await getCurrentUser(args, ctx);

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
