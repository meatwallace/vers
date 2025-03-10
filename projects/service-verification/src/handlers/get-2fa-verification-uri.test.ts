import { expect, test } from 'vitest';
import { createId } from '@paralleldrive/cuid2';
import * as schema from '@vers/postgres-schema';
import { PostgresTestUtils } from '@vers/service-test-utils';
import { pgTestConfig } from '../pg-test-config';
import { router } from '../router';
import { t } from '../t';

const createCaller = t.createCallerFactory(router);

async function setupTest() {
  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const caller = createCaller({ db });

  return { caller, db, teardown };
}

test('it returns a TOTP auth URI for a valid 2FA verification record', async () => {
  const { caller, db, teardown } = await setupTest();

  const verification = {
    algorithm: 'SHA-1',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
    createdAt: new Date(),
    digits: 6,
    expiresAt: null,
    id: createId(),
    period: 30,
    secret: 'ABCDEFGHIJKLMNOP',
    target: 'test@example.com',
    type: '2fa-setup',
  } as const;

  await db.insert(schema.verifications).values(verification);

  const result = await caller.get2FAVerificationURI({
    target: 'test@example.com',
  });

  expect(result).toStrictEqual({
    otpURI: expect.stringContaining('otpauth://totp/vers:test%40example.com'),
  });

  await teardown();
});

test('it throws an error for non-existent 2FA verification record', async () => {
  const { caller, teardown } = await setupTest();

  await expect(
    caller.get2FAVerificationURI({
      target: 'test@example.com',
    }),
  ).rejects.toMatchObject({
    code: 'BAD_REQUEST',
    message: 'No 2FA verification found for this target',
  });

  await teardown();
});
