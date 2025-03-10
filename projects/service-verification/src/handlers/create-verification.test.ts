import { expect, test } from 'vitest';
import * as schema from '@vers/postgres-schema';
import { PostgresTestUtils } from '@vers/service-test-utils';
import { and, eq } from 'drizzle-orm';
import { pgTestConfig } from '../pg-test-config';
import { router } from '../router';
import { t } from '../t';

const createCaller = t.createCallerFactory(router);

async function setupTest() {
  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const caller = createCaller({ db });

  return { caller, db, teardown };
}

test('creates a verification code and stores a record of it', async () => {
  const { caller, db, teardown } = await setupTest();

  const result = await caller.createVerification({
    period: 5 * 60, // 5 minutes
    target: 'test@example.com',
    type: 'onboarding',
  });

  expect(result).toStrictEqual({
    id: expect.any(String),
    otp: expect.any(String),
    target: 'test@example.com',
    type: 'onboarding',
  });

  const verification = await db.query.verifications.findFirst({
    where: and(
      eq(schema.verifications.target, 'test@example.com'),
      eq(schema.verifications.type, 'onboarding'),
    ),
  });

  expect(verification).toStrictEqual({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
    createdAt: expect.any(Date),
    digits: 6,
    expiresAt: null,
    id: expect.any(String),
    period: 300,
    secret: expect.any(String),
    target: 'test@example.com',
    type: 'onboarding',
  });

  await teardown();
});

test('it uses a simple charset for 2FA verification codes', async () => {
  const { caller, db, teardown } = await setupTest();

  const result = await caller.createVerification({
    target: 'test@example.com',
    type: '2fa',
  });

  expect(result).toStrictEqual({
    id: expect.any(String),
    otp: expect.any(String),
    target: 'test@example.com',
    type: '2fa',
  });

  const verification = await db.query.verifications.findFirst({
    where: and(
      eq(schema.verifications.target, 'test@example.com'),
      eq(schema.verifications.type, '2fa'),
    ),
  });

  expect(verification).toStrictEqual({
    algorithm: 'SHA-256',
    charSet: '0123456789',
    createdAt: expect.any(Date),
    digits: 6,
    expiresAt: null,
    id: expect.any(String),
    period: 30,
    secret: expect.any(String),
    target: 'test@example.com',
    type: '2fa',
  });

  await teardown();
});

test('it uses a simple charset for 2FA setup verification codes', async () => {
  const { caller, db, teardown } = await setupTest();

  const result = await caller.createVerification({
    target: 'test@example.com',
    type: '2fa-setup',
  });

  expect(result).toStrictEqual({
    id: expect.any(String),
    otp: expect.any(String),
    target: 'test@example.com',
    type: '2fa-setup',
  });

  const verification = await db.query.verifications.findFirst({
    where: and(
      eq(schema.verifications.target, 'test@example.com'),
      eq(schema.verifications.type, '2fa-setup'),
    ),
  });

  expect(verification).toStrictEqual({
    algorithm: 'SHA-256',
    charSet: '0123456789',
    createdAt: expect.any(Date),
    digits: 6,
    expiresAt: null,
    id: expect.any(String),
    period: 30,
    secret: expect.any(String),
    target: 'test@example.com',
    type: '2fa-setup',
  });

  await teardown();
});

test('replaces existing verification for same target and type', async () => {
  const { caller, db, teardown } = await setupTest();

  await caller.createVerification({
    period: 300,
    target: 'test@example.com',
    type: 'onboarding',
  });

  const result = await caller.createVerification({
    period: 300,
    target: 'test@example.com',
    type: 'onboarding',
  });

  expect(result).toStrictEqual({
    id: expect.any(String),
    otp: expect.any(String),
    target: 'test@example.com',
    type: 'onboarding',
  });

  const verifications = await db.query.verifications.findMany({
    where: and(
      eq(schema.verifications.type, 'onboarding'),
      eq(schema.verifications.target, 'test@example.com'),
    ),
  });

  expect(verifications).toHaveLength(1);

  await teardown();
});

test('creates a verification with explicit expiry time', async () => {
  const { caller, db, teardown } = await setupTest();

  const now = Date.now();

  const result = await caller.createVerification({
    expiresAt: new Date(now + 10 * 60 * 1000),
    target: 'test@example.com',
    type: 'onboarding',
  });

  expect(result).toStrictEqual({
    id: expect.any(String),
    otp: expect.any(String),
    target: 'test@example.com',
    type: 'onboarding',
  });

  const verification = await db.query.verifications.findFirst({
    where: and(
      eq(schema.verifications.target, 'test@example.com'),
      eq(schema.verifications.type, 'onboarding'),
    ),
  });

  expect(verification).toBeDefined();
  expect(verification).toStrictEqual({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
    createdAt: expect.any(Date),
    digits: 6,
    expiresAt: new Date(now + 10 * 60 * 1000),
    id: expect.any(String),
    period: 30,
    secret: expect.any(String),
    target: 'test@example.com',
    type: 'onboarding',
  });

  await teardown();
});
