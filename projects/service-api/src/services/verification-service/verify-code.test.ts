import { drop } from '@mswjs/data';
import { ServiceID } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { verifyCode } from './verify-code';

test('it verifies a code', async () => {
  const verification = db.verification.create({
    type: 'onboarding',
    target: 'test@example.com',
    expiresAt: new Date(Date.now() + 1000 * 60 * 5),
    createdAt: new Date(),
  });

  const ctx = createServiceContext({
    serviceID: ServiceID.ServiceVerification,
    requestID: 'test',
    apiURL: env.VERIFICATIONS_SERVICE_URL,
  });

  const args = {
    type: 'onboarding',
    target: 'test@example.com',
    code: '999999',
  } as const;

  const result = await verifyCode(args, ctx);

  expect(result).toMatchObject({
    type: verification.type,
    target: verification.target,
  });

  drop(db);
});
