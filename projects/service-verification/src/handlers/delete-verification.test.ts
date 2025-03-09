import { expect, test } from 'vitest';
import * as schema from '@chrono/postgres-schema';
import { PostgresTestUtils } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { Hono } from 'hono';
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

  const response = await app.request('/delete-verification', {
    body: JSON.stringify({
      id,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const result = await response.json();

  expect(response.status).toBe(200);
  expect(result).toEqual({
    data: {
      deletedID: id,
    },
    success: true,
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
    body: 'invalid-json',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const result = await response.json();

  expect(result).toEqual({
    error: 'An unknown error occurred',
    success: false,
  });

  await teardown();
});
