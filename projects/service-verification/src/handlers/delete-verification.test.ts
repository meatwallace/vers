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

test('it deletes a verification record', async () => {
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
    type: '2fa',
  });

  const result = await caller.deleteVerification({ id });

  expect(result).toStrictEqual({ deletedID: id });

  // Verify the record was actually deleted
  const verification = await db.query.verifications.findFirst({
    where: (verifications, { eq }) => eq(verifications.id, id),
  });

  expect(verification).toBeUndefined();

  await teardown();
});
