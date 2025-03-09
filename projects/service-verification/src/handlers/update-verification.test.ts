import { expect, test } from 'vitest';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import * as schema from '@chrono/postgres-schema';
import { PostgresTestUtils } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { pgTestConfig } from '../pg-test-config';
import { updateVerification } from './update-verification';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  app.post('/update-verification', async (ctx) => updateVerification(ctx, db));

  return { app, db, teardown };
}

test('should update a verification record ', async () => {
  const { app, db, teardown } = await setupTest();

  const id = createId();

  await db.insert(schema.verifications).values({
    id,
    type: '2fa-setup',
    target: 'user@example.com',
    secret: 'test-secret',
    algorithm: 'SHA-256',
    digits: 6,
    period: 30,
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
    createdAt: new Date(),
  });

  const response = await app.request('/update-verification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      type: '2fa',
    }),
  });

  const result = await response.json();

  expect(response.status).toBe(200);
  expect(result).toEqual({
    success: true,
    data: {
      updatedID: id,
    },
  });

  const updatedVerification = await db.query.verifications.findFirst({
    where: eq(schema.verifications.id, id),
  });

  expect(updatedVerification).toMatchObject({
    id,
    type: '2fa',
    target: 'user@example.com',
    secret: 'test-secret',
    algorithm: 'SHA-256',
    digits: 6,
    period: 30,
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
    createdAt: expect.any(Date),
  });

  await teardown();
});

test('should handle errors gracefully', async () => {
  const { app, teardown } = await setupTest();

  const response = await app.request('/update-verification', {
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
