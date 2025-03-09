import { ServiceID } from '@chrono/service-types';
import { generateTOTP } from '@epic-web/totp';
import { drop } from '@mswjs/data';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { verifyCode } from './verify-code';

test('it verifies a code', async () => {
  const { otp, ...verificationConfig } = await generateTOTP({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
  });

  const verification = db.verification.create({
    target: 'test@example.com',
    type: 'onboarding',
    ...verificationConfig,
  });

  const ctx = createServiceContext({
    apiURL: env.VERIFICATIONS_SERVICE_URL,
    requestID: 'test',
    serviceID: ServiceID.ServiceVerification,
  });

  const args = {
    code: otp,
    target: 'test@example.com',
    type: 'onboarding',
  } as const;

  const result = await verifyCode(args, ctx);

  expect(result).toMatchObject({
    target: verification.target,
    type: verification.type,
  });

  drop(db);
});
