import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { ServiceID } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { createSession } from './create-session';

test('it creates a new session', async () => {
  const user = db.user.create({
    email: 'user@test.com',
  });

  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceSession,
    apiURL: env.SESSIONS_SERVICE_URL,
  });

  const args = {
    userID: user.id,
    ipAddress: '127.0.0.1',
    rememberMe: true,
  };

  const result = await createSession(args, ctx);

  expect(result).toMatchObject({
    accessToken: expect.any(String),
    refreshToken: expect.any(String),
    session: {
      id: expect.any(String),
      userID: user.id,
      ipAddress: '127.0.0.1',
      expiresAt: expect.any(Date),
    },
  });

  drop(db);
});
