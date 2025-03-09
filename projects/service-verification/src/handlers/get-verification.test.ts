import { expect, test } from 'vitest';
import * as schema from '@chrono/postgres-schema';
import { PostgresTestUtils } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { pgTestConfig } from '../pg-test-config';
import { getVerification } from './get-verification';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  app.post('/get-verification', async (ctx) => getVerification(ctx, db));

  return { app, db, teardown };
}

test('it returns an existing verification', async () => {
  const { app, db, teardown } = await setupTest();

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

  const req = new Request('http://localhost/get-verification', {
    body: JSON.stringify({
      target: 'test@example.com',
      type: 'onboarding',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: {
      id: verification.id,
      target: verification.target,
      type: verification.type,
    },
    success: true,
  });

  await teardown();
});

test('it returns null for non-existent verification', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/get-verification', {
    body: JSON.stringify({
      target: 'test@example.com',
      type: 'onboarding',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: null,
    success: true,
  });

  await teardown();
});

test('it handles and deletes expired verifications', async () => {
  const { app, db, teardown } = await setupTest();

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

  const req = new Request('http://localhost/get-verification', {
    body: JSON.stringify({
      target: 'test@example.com',
      type: 'onboarding',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: null,
    success: true,
  });

  // verify the record was deleted
  const verifications = await db.query.verifications.findMany({
    where: eq(schema.verifications.id, verification.id),
  });

  expect(verifications).toHaveLength(0);

  await teardown();
});

test('handles an invalid request body', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/get-verification', {
    body: 'invalid json',
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    error: 'An unknown error occurred',
    success: false,
  });

  await teardown();
});
