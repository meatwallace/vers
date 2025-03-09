import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { ServiceID } from '@vers/service-types';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { get2FAVerificationURI } from './get-2fa-verification-uri';

afterEach(() => {
  drop(db);
});

test('it retrieves a 2FA verification URI', async () => {
  db.verification.create({
    algorithm: 'SHA-1',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
    digits: 6,
    period: 30,
    secret: 'ABCDEFGHIJKLMNOP',
    target: 'test@example.com',
    type: '2fa-setup',
  });

  const ctx = createServiceContext({
    apiURL: env.VERIFICATIONS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceVerification,
  });

  const args = {
    target: 'test@example.com',
  } as const;

  const result = await get2FAVerificationURI(args, ctx);

  expect(result).toMatch('otpauth://totp/vers:test%40example.com');
  expect(result).toContain('secret=');
  expect(result).toContain('issuer=vers');
});
