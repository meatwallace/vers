import { Hono } from 'hono';
import { expect, test } from 'vitest';
import * as schema from '@chrono/postgres-schema';
import { PostgresTestUtils } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { pgTestConfig } from '../pg-test-config';
import { deleteVerification } from './delete-verification';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  app.post('/delete-verification', async (ctx) => deleteVerification(ctx, db));

  return { app, db, teardown };
}

test('it deletes a verification record', async () => {
  const { app, db, teardown } = await setupTest();

  const id = createId();

  await db.insert(schema.verifications).values({
    id,
    type: '2fa',
    target: 'user@example.com',
    secret: 'test-secret',
    algorithm: 'SHA-256',
    digits: 6,
    period: 30,
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
    createdAt: new Date(),
  });

  const response = await app.request('/delete-verification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
    }),
  });

  const result = await response.json();

  expect(response.status).toBe(200);
  expect(result).toEqual({
    success: true,
    data: {
      deletedID: id,
    },
  });

  // Verify the record was actually deleted
  const verification = await db.query.verifications.findFirst({
    where: (verifications, { eq }) => eq(verifications.id, id),
  });

  expect(verification).toBeUndefined();

  await teardown();
});

test('it handles errors gracefully', async () => {
  const { app, teardown } = await setupTest();

  const response = await app.request('/delete-verification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: 'invalid-json',
  });

  const result = await response.json();

  expect(result).toEqual({
    success: false,
    error: 'An unknown error occurred',
  });

  await teardown();
});
