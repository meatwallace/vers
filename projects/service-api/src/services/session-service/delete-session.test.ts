import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { ServiceID } from '@vers/service-types';
import { http, HttpResponse } from 'msw';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { server } from '../../mocks/node';
import { createServiceContext } from '../utils';
import { deleteSession } from './delete-session';

afterEach(() => {
  server.resetHandlers();
});

test('it deletes a session', async () => {
  const user = db.user.create({
    email: 'user@test.com',
  });

  const session = db.session.create({
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    id: 'test_session_id',
    refreshToken: 'test_refresh_token',
    userID: user.id,
  });

  const ctx = createServiceContext({
    apiURL: env.SESSIONS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceSession,
  });

  const args = { id: session.id, userID: user.id };

  const result = await deleteSession(args, ctx);

  expect(result).toBe(true);

  drop(db);
});

test('it throws an error if the request fails', async () => {
  server.use(
    http.post(`${env.SESSIONS_SERVICE_URL}delete-session`, () => {
      return HttpResponse.json({
        success: false,
      });
    }),
  );

  const ctx = createServiceContext({
    apiURL: env.SESSIONS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceSession,
  });

  const args = { id: 'test_session_id', userID: 'test_user_id' };

  await expect(deleteSession(args, ctx)).rejects.toThrow(
    'An unknown error occurred',
  );

  drop(db);
});
