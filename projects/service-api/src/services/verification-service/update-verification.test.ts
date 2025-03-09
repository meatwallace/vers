import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { createTestJWT } from '@vers/service-test-utils';
import { ServiceID } from '@vers/service-types';
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
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    id: 'test_id',
    target: user.id,
    type: '2fa-setup',
  });

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
    sub: user.id,
  });

  const ctx = createServiceContext({
    accessToken,
    apiURL: env.VERIFICATIONS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceVerification,
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
    expiresAt: expect.any(Date),
    id: 'test_id',
    target: user.id,
    type: '2fa',
  });
});
