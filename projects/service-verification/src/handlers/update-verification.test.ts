import { expect, test } from 'vitest';
import * as schema from '@chrono/postgres-schema';
import { PostgresTestUtils } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
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

  const response = await app.request('/update-verification', {
    body: JSON.stringify({
      id,
      type: '2fa',
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
      updatedID: id,
    },
    success: true,
  });

  const updatedVerification = await db.query.verifications.findFirst({
    where: eq(schema.verifications.id, id),
  });

  expect(updatedVerification).toMatchObject({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
    createdAt: expect.any(Date),
    digits: 6,
    id,
    period: 30,
    secret: 'test-secret',
    target: 'user@example.com',
    type: '2fa',
  });

  await teardown();
});

test('should handle errors gracefully', async () => {
  const { app, teardown } = await setupTest();

  const response = await app.request('/update-verification', {
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
