import { expect, test } from 'vitest';
import { createId } from '@paralleldrive/cuid2';
import * as schema from '@vers/postgres-schema';
import { PostgresTestUtils } from '@vers/service-test-utils';
import { eq } from 'drizzle-orm';
import { pgTestConfig } from '../pg-test-config';
import { router } from '../router';
import { t } from '../t';

const createCaller = t.createCallerFactory(router);

async function setupTest() {
  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const caller = createCaller({ db });

  return { caller, db, teardown };
}

test('it returns an existing verification', async () => {
  const { caller, db, teardown } = await setupTest();

  const verification = {
    algorithm: 'sha1',
    charSet: 'hex',
    createdAt: new Date(),
    digits: 6,
    expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes from now
    id: createId(),
    period: 300,
    secret: 'ABC123',
    target: 'test@example.com',
    type: 'onboarding',
  } as const;

  await db.insert(schema.verifications).values(verification);

  const result = await caller.getVerification({
    target: 'test@example.com',
    type: 'onboarding',
  });

  expect(result).toStrictEqual({
    id: verification.id,
    target: verification.target,
    type: verification.type,
  });

  await teardown();
});

test('it returns null for non-existent verification', async () => {
  const { caller, teardown } = await setupTest();

  const result = await caller.getVerification({
    target: 'test@example.com',
    type: 'onboarding',
  });

  expect(result).toBeNull();

  await teardown();
});

test('it handles and deletes expired verifications', async () => {
  const { caller, db, teardown } = await setupTest();

  const verification = {
    algorithm: 'sha1',
    charSet: 'hex',
    createdAt: new Date(),
    digits: 6,
    expiresAt: new Date(Date.now() - 1000), // 1 second ago
    id: createId(),
    period: 300,
    secret: 'ABC123',
    target: 'test@example.com',
    type: 'onboarding',
  } as const;

  await db.insert(schema.verifications).values(verification);

  const result = await caller.getVerification({
    target: 'test@example.com',
    type: 'onboarding',
  });

  expect(result).toBeNull();

  // verify the record was deleted
  const verifications = await db.query.verifications.findMany({
    where: eq(schema.verifications.id, verification.id),
  });

  expect(verifications).toHaveLength(0);

  await teardown();
});
