import { ServiceID } from '@chrono/service-types';
import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { createSession } from './create-session';

test('it creates a new session', async () => {
  const user = db.user.create({
    email: 'user@test.com',
  });

  const ctx = createServiceContext({
    apiURL: env.SESSIONS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceSession,
  });

  const args = {
    ipAddress: '127.0.0.1',
    rememberMe: true,
    userID: user.id,
  };

  const result = await createSession(args, ctx);

  expect(result).toMatchObject({
    accessToken: expect.any(String),
    refreshToken: expect.any(String),
    session: {
      expiresAt: expect.any(Date),
      id: expect.any(String),
      ipAddress: '127.0.0.1',
      userID: user.id,
    },
  });

  drop(db);
});
