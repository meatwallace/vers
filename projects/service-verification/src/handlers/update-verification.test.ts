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

test('should update a verification record', async () => {
  const { caller, db, teardown } = await setupTest();

  const id = createId();

  await db.insert(schema.verifications).values({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
    createdAt: new Date(),
    digits: 6,
    id,
    period: 30,
    secret: 'test-secret',
    target: 'user@example.com',
    type: '2fa-setup',
  });

  const result = await caller.updateVerification({
    id,
    type: '2fa',
  });

  expect(result).toStrictEqual({
    updatedID: id,
  });

  const updatedVerification = await db.query.verifications.findFirst({
    where: eq(schema.verifications.id, id),
  });

  expect(updatedVerification).toStrictEqual({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
    createdAt: expect.any(Date),
    digits: 6,
    expiresAt: null,
    id,
    period: 30,
    secret: 'test-secret',
    target: 'user@example.com',
    type: '2fa',
  });

  await teardown();
});
