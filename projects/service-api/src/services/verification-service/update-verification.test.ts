import { createTestJWT } from '@chrono/service-test-utils';
import { ServiceID } from '@chrono/service-types';
import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { updateVerification } from './update-verification';

afterEach(() => {
  drop(db);
});

test('it updates a verification', async () => {
  const user = db.user.create({});

  db.verification.create({
    id: 'test_id',
    type: '2fa-setup',
    target: user.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });

  const accessToken = await createTestJWT({
    sub: user.id,
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
  });

  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceWorld,
    apiURL: env.VERIFICATIONS_SERVICE_URL,
    accessToken,
  });

  const args = {
    id: 'test_id',
    type: '2fa',
  } as const;

  const result = await updateVerification(args, ctx);

  expect(result).toMatchObject({ success: true });

  const updatedVerification = db.verification.findFirst({
    where: { id: { equals: 'test_id' } },
  });

  expect(updatedVerification).toMatchObject({
    id: 'test_id',
    type: '2fa',
    target: user.id,
    expiresAt: expect.any(Date),
  });
});
