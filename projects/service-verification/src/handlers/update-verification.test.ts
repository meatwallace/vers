import { expect, test } from 'vitest';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { createId } from '@paralleldrive/cuid2';
import * as schema from '@vers/postgres-schema';
import { createTestDB } from '@vers/service-test-utils';
import { eq } from 'drizzle-orm';
import { router } from '../router';
import { t } from '../t';

const createCaller = t.createCallerFactory(router);

interface TestConfig {
  db: PostgresJsDatabase<typeof schema>;
}

function setupTest(config: TestConfig) {
  const caller = createCaller({ db: config.db });

  return { caller };
}

test('should update a verification record', async () => {
  await using handle = await createTestDB();

  const { db } = handle;

  const { caller } = setupTest({ db });

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
});

test('should throw an error if the verification is not found', async () => {
  await using handle = await createTestDB();

  const { db } = handle;

  const { caller } = setupTest({ db });

  const update = {
    id: 'non-existent-id',
    type: '2fa',
  } as const;

  await expect(caller.updateVerification(update)).rejects.toMatchObject({
    code: 'NOT_FOUND',
    message: 'Verification not found',
  });
});
