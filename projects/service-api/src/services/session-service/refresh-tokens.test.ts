import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { createTestJWT } from '@vers/service-test-utils';
import { ServiceID } from '@vers/service-types';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { refreshTokens } from './refresh-tokens';

const ISSUER = `https://${env.API_IDENTIFIER}/`;

test('it refreshes the session tokens', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    id: 'test_id',
  });

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
  const refreshToken = 'test_refresh_token';

  const session = db.session.create({
    expiresAt,
    id: 'test_session_1',
    refreshToken,
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

  const args = { refreshToken };

  const result = await refreshTokens(args, ctx);

  expect(result).toMatchObject({
    accessToken: expect.any(String),
    refreshToken: expect.any(String),
    session: {
      expiresAt: expect.any(Date),
      id: session.id,
      ipAddress: session.ipAddress,
      userID: user.id,
    },
  });

  drop(db);
});
