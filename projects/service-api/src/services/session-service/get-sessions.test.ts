import { drop } from '@mswjs/data';
import { createTestJWT } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { ServiceID } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { getSessions } from './get-sessions';

const ISSUER = `https://${env.API_IDENTIFIER}/`;

test('it returns the user sessions', async () => {
  const user = db.user.create({
    id: 'test_id',
    email: 'user@test.com',
  });

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  db.session.create({
    id: 'test_session_1',
    userID: user.id,
    ipAddress: '127.0.0.1',
    refreshToken: 'test_refresh_token_1',
    expiresAt,
  });

  db.session.create({
    id: 'test_session_2',
    userID: user.id,
    ipAddress: '127.0.0.2',
    refreshToken: 'test_refresh_token_2',
    expiresAt,
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

  const args = { userID: user.id };

  const result = await getSessions(args, ctx);

  expect(result).toMatchObject([
    {
      id: 'test_session_1',
      userID: user.id,
      ipAddress: '127.0.0.1',
      expiresAt: expect.any(Date),
    },
    {
      id: 'test_session_2',
      userID: user.id,
      ipAddress: '127.0.0.2',
      expiresAt: expect.any(Date),
    },
  ]);

  drop(db);
});
