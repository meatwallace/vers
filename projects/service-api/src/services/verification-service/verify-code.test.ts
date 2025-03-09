import { generateTOTP } from '@epic-web/totp';
import { drop } from '@mswjs/data';
import { ServiceID } from '@chrono/service-types';
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
    type: 'onboarding',
    target: 'test@example.com',
    ...verificationConfig,
  });

  const ctx = createServiceContext({
    serviceID: ServiceID.ServiceVerification,
    requestID: 'test',
    apiURL: env.VERIFICATIONS_SERVICE_URL,
  });

  const args = {
    type: 'onboarding',
    target: 'test@example.com',
    code: otp,
  } as const;

  const result = await verifyCode(args, ctx);

  expect(result).toMatchObject({
    type: verification.type,
    target: verification.target,
  });

  drop(db);
});
