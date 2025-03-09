import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { createTestJWT } from '@vers/service-test-utils';
import { ServiceID } from '@vers/service-types';
import { http, HttpResponse } from 'msw';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { server } from '~/mocks/node';
import { createServiceContext } from '../utils';
import { getSession } from './get-session';

const ISSUER = `https://${env.API_IDENTIFIER}/`;

afterEach(() => {
  server.resetHandlers();

  drop(db);
});

test('it returns the session data', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    id: 'test_id',
  });

  const now = Date.now();

  const session = db.session.create({
    expiresAt: new Date(now + 1000 * 60 * 60 * 24),
    id: 'test_session',
    ipAddress: '127.0.0.1',
    refreshToken: 'test_refresh_token',
    userID: user.id,
  });

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: ISSUER,
    sub: user.id,
  });

  const ctx = createServiceContext({
    accessToken,
    apiURL: env.SESSIONS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceSession,
  });

  const result = await getSession({ id: session.id }, ctx);

  expect(result).toMatchObject({
    createdAt: expect.any(Date),
    expiresAt: new Date(now + 1000 * 60 * 60 * 24),
    id: session.id,
    ipAddress: '127.0.0.1',
    updatedAt: expect.any(Date),
    userID: user.id,
  });
});

test('it returns null when session is not found', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    id: 'test_id',
  });

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: ISSUER,
    sub: user.id,
  });

  const ctx = createServiceContext({
    accessToken,
    apiURL: env.SESSIONS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceSession,
  });

  const result = await getSession({ id: createId() }, ctx);

  expect(result).toBeNull();
});

test('it throws an error when the request fails', async () => {
  server.use(
    http.post(`${env.SESSIONS_SERVICE_URL}get-session`, () => {
      return HttpResponse.json({
        success: false,
      });
    }),
  );

  const user = db.user.create({
    email: 'user@test.com',
    id: 'test_id',
  });

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: ISSUER,
    sub: user.id,
  });

  const ctx = createServiceContext({
    accessToken,
    apiURL: env.SESSIONS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceSession,
  });

  await expect(getSession({ id: 'error' }, ctx)).rejects.toThrow(
    'An unknown error occurred',
  );
});
