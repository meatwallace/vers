import { http, HttpResponse } from 'msw';
import { drop } from '@mswjs/data';
import { createTestJWT } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { ServiceID } from '@chrono/service-types';
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
    id: 'test_id',
    email: 'user@test.com',
  });

  const now = Date.now();

  const session = db.session.create({
    id: 'test_session',
    userID: user.id,
    refreshToken: 'test_refresh_token',
    ipAddress: '127.0.0.1',
    expiresAt: new Date(now + 1000 * 60 * 60 * 24),
  });

  const accessToken = await createTestJWT({
    sub: user.id,
    audience: env.API_IDENTIFIER,
    issuer: ISSUER,
  });

  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceSession,
    apiURL: env.SESSIONS_SERVICE_URL,
    accessToken,
  });

  const result = await getSession({ id: session.id }, ctx);

  expect(result).toMatchObject({
    id: session.id,
    userID: user.id,
    ipAddress: '127.0.0.1',
    expiresAt: new Date(now + 1000 * 60 * 60 * 24),
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  });
});

test('it returns null when session is not found', async () => {
  const user = db.user.create({
    id: 'test_id',
    email: 'user@test.com',
  });

  const accessToken = await createTestJWT({
    sub: user.id,
    audience: env.API_IDENTIFIER,
    issuer: ISSUER,
  });

  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceSession,
    apiURL: env.SESSIONS_SERVICE_URL,
    accessToken,
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
    id: 'test_id',
    email: 'user@test.com',
  });

  const accessToken = await createTestJWT({
    sub: user.id,
    audience: env.API_IDENTIFIER,
    issuer: ISSUER,
  });

  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceSession,
    apiURL: env.SESSIONS_SERVICE_URL,
    accessToken,
  });

  await expect(getSession({ id: 'error' }, ctx)).rejects.toThrow(
    'An unknown error occurred',
  );
});
