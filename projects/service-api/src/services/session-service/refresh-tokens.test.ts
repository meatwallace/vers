import { drop } from '@mswjs/data';
import { createTestJWT } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { ServiceID } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { refreshTokens } from './refresh-tokens';

const ISSUER = `https://${env.API_IDENTIFIER}/`;

test('it refreshes the session tokens', async () => {
  const user = db.user.create({
    id: 'test_id',
    email: 'user@test.com',
  });

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
  const refreshToken = 'test_refresh_token';

  const session = db.session.create({
    id: 'test_session_1',
    userID: user.id,
    refreshToken,
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

  const args = { refreshToken };

  const result = await refreshTokens(args, ctx);

  expect(result).toMatchObject({
    accessToken: expect.any(String),
    refreshToken: expect.any(String),
    session: {
      id: session.id,
      userID: user.id,
      ipAddress: session.ipAddress,
      expiresAt: expect.any(Date),
    },
  });

  drop(db);
});
