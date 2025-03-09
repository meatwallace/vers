import { createTestJWT } from '@chrono/service-test-utils';
import { ServiceID } from '@chrono/service-types';
import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { getSessions } from './get-sessions';

const ISSUER = `https://${env.API_IDENTIFIER}/`;

test('it returns the user sessions', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    id: 'test_id',
  });

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  db.session.create({
    expiresAt,
    id: 'test_session_1',
    ipAddress: '127.0.0.1',
    refreshToken: 'test_refresh_token_1',
    userID: user.id,
  });

  db.session.create({
    expiresAt,
    id: 'test_session_2',
    ipAddress: '127.0.0.2',
    refreshToken: 'test_refresh_token_2',
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

  const args = { userID: user.id };

  const result = await getSessions(args, ctx);

  expect(result).toMatchObject([
    {
      createdAt: expect.any(Date),
      expiresAt: expect.any(Date),
      id: 'test_session_1',
      ipAddress: '127.0.0.1',
      updatedAt: expect.any(Date),
      userID: user.id,
    },
    {
      createdAt: expect.any(Date),
      expiresAt: expect.any(Date),
      id: 'test_session_2',
      ipAddress: '127.0.0.2',
      updatedAt: expect.any(Date),
      userID: user.id,
    },
  ]);

  drop(db);
});
