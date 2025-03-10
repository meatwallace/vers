import { expect, test } from 'vitest';
import { createId } from '@paralleldrive/cuid2';
import * as schema from '@vers/postgres-schema';
import { PostgresTestUtils } from '@vers/service-test-utils';
import { eq } from 'drizzle-orm';
import invariant from 'tiny-invariant';
import { pgTestConfig } from '../pg-test-config';
import { router } from '../router';
import { t } from '../t';

const createCaller = t.createCallerFactory(router);

async function setupTest() {
  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const caller = createCaller({ db });

  return { caller, db, teardown };
}

test('it verifies a valid code', async () => {
  const { caller, db, teardown } = await setupTest();

  const createResult = await caller.createVerification({
    period: 300,
    target: 'test@example.com',
    type: 'onboarding',
  });

  const verifyResult = await caller.verifyCode({
    code: createResult.otp,
    target: 'test@example.com',
    type: 'onboarding',
  });

  expect(verifyResult).toStrictEqual({
    id: expect.any(String),
    target: 'test@example.com',
    type: 'onboarding',
  });

  invariant(verifyResult);

  // verify the record was deleted
  const verifications = await db.query.verifications.findMany({
    where: eq(schema.verifications.id, verifyResult.id),
  });

  expect(verifications).toHaveLength(0);

  await teardown();
});

test('it rejects invalid code', async () => {
  const { caller, teardown } = await setupTest();

  await expect(
    caller.verifyCode({
      code: 'INVALID',
      target: 'test@example.com',
      type: 'onboarding',
    }),
  ).rejects.toMatchObject({
    code: 'BAD_REQUEST',
    message: 'Invalid verification code',
  });

  await teardown();
});

test('it rejects expired codes', async () => {
  const { caller, db, teardown } = await setupTest();

  const verification = {
    algorithm: 'sha1',
    charSet: 'hex',
    createdAt: new Date(),
    digits: 6,
    expiresAt: new Date(Date.now() - 1000),
    id: createId(),
    period: 300,
    secret: 'ABC123',
    target: 'test@example.com',
    type: 'onboarding',
  } as const;

  await db.insert(schema.verifications).values(verification);

  await expect(
    caller.verifyCode({
      code: verification.secret,
      target: 'test@example.com',
      type: 'onboarding',
    }),
  ).rejects.toMatchObject({
    code: 'BAD_REQUEST',
    message: 'Verification code has expired',
  });

  // verify the record was deleted
  const verifications = await db.query.verifications.findMany({
    where: eq(schema.verifications.id, verification.id),
  });

  expect(verifications).toHaveLength(0);

  await teardown();
});

test('it does not delete a 2FA setup verification', async () => {
  const { caller, db, teardown } = await setupTest();

  const createResult = await caller.createVerification({
    target: 'test@example.com',
    type: '2fa-setup',
  });

  const verifyResult = await caller.verifyCode({
    code: createResult.otp,
    target: 'test@example.com',
    type: '2fa-setup',
  });

  expect(verifyResult).toStrictEqual({
    id: createResult.id,
    target: 'test@example.com',
    type: '2fa-setup',
  });

  const verification = await db.query.verifications.findFirst({
    where: eq(schema.verifications.id, createResult.id),
  });

  expect(verification).toBeDefined();

  await teardown();
});

test('it does not delete a 2FA verification', async () => {
  const { caller, db, teardown } = await setupTest();

  const createResult = await caller.createVerification({
    target: 'test@example.com',
    type: '2fa',
  });

  const verifyResult = await caller.verifyCode({
    code: createResult.otp,
    target: 'test@example.com',
    type: '2fa',
  });

  expect(verifyResult).toStrictEqual({
    id: createResult.id,
    target: 'test@example.com',
    type: '2fa',
  });

  const verification = await db.query.verifications.findFirst({
    where: eq(schema.verifications.id, createResult.id),
  });

  expect(verification).toBeDefined();

  await teardown();
});
