import { ServiceID } from '@chrono/service-types';
import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { get2FAVerificationURI } from './get-2fa-verification-uri';

afterEach(() => {
  drop(db);
});

test('it retrieves a 2FA verification URI', async () => {
  db.verification.create({
    type: '2fa-setup',
    target: 'test@example.com',
    secret: 'ABCDEFGHIJKLMNOP',
    algorithm: 'SHA-1',
    digits: 6,
    period: 30,
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
  });

  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceVerification,
    apiURL: env.VERIFICATIONS_SERVICE_URL,
  });

  const args = {
    target: 'test@example.com',
  } as const;

  const result = await get2FAVerificationURI(args, ctx);

  expect(result).toMatch('otpauth://totp/Chrononomicon:test%40example.com');
  expect(result).toContain('secret=');
  expect(result).toContain('issuer=Chrononomicon');
});
