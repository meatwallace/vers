import { Hono } from 'hono';
import { test, expect } from 'vitest';
import { eq } from 'drizzle-orm';
import { PostgresTestUtils } from '@chrono/service-test-utils';
import * as schema from '@chrono/postgres-schema';
import { createId } from '@paralleldrive/cuid2';
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
    id: createId(),
    type: 'onboarding',
    target: 'test@example.com',
    secret: 'ABC123',
    algorithm: 'sha1',
    digits: 6,
    period: 300,
    charSet: 'hex',
    expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes from now
    createdAt: new Date(),
  } as const;

  await db.insert(schema.verifications).values(verification);

  const req = new Request('http://localhost/get-verification', {
    method: 'POST',
    body: JSON.stringify({
      type: 'onboarding',
      target: 'test@example.com',
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: {
      id: verification.id,
      type: verification.type,
      target: verification.target,
    },
  });

  await teardown();
});

test('it returns null for non-existent verification', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/get-verification', {
    method: 'POST',
    body: JSON.stringify({
      type: 'onboarding',
      target: 'test@example.com',
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: null,
  });

  await teardown();
});

test('it handles and deletes expired verifications', async () => {
  const { app, db, teardown } = await setupTest();

  const verification = {
    id: createId(),
    type: 'onboarding',
    target: 'test@example.com',
    secret: 'ABC123',
    algorithm: 'sha1',
    digits: 6,
    period: 300,
    charSet: 'hex',
    expiresAt: new Date(Date.now() - 1000), // 1 second ago
    createdAt: new Date(),
  } as const;

  await db.insert(schema.verifications).values(verification);

  const req = new Request('http://localhost/get-verification', {
    method: 'POST',
    body: JSON.stringify({
      type: 'onboarding',
      target: 'test@example.com',
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: null,
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
    method: 'POST',
    body: 'invalid json',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: false,
    error: 'An unknown error occurred',
  });

  await teardown();
});
