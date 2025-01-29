import { Hono } from 'hono';
import { test, expect } from 'vitest';
import { eq } from 'drizzle-orm';
import { PostgresTestUtils } from '@chrono/service-test-utils';
import * as schema from '@chrono/postgres-schema';
import { createId } from '@paralleldrive/cuid2';
import { pgTestConfig } from '../pg-test-config';
import { verifyCode } from './verify-code';
import { createVerification } from './create-verification';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  app.post('/verify-code', async (ctx) => verifyCode(ctx, db));
  app.post('/create-verification', async (ctx) => createVerification(ctx, db));

  return { app, db, teardown };
}

test('it verifies a valid code', async () => {
  const { app, db, teardown } = await setupTest();

  const createReq = new Request('http://localhost/create-verification', {
    method: 'POST',
    body: JSON.stringify({
      type: 'onboarding',
      target: 'test@example.com',
      period: 300,
    }),
  });

  const createRes = await app.request(createReq);
  const createBody = (await createRes.json()) as {
    success: boolean;
    data: { otp: string };
  };

  const verifyReq = new Request('http://localhost/verify-code', {
    method: 'POST',
    body: JSON.stringify({
      type: 'onboarding',
      target: 'test@example.com',
      code: createBody.data.otp,
    }),
  });

  const verifyRes = await app.request(verifyReq);
  const verifyBody = (await verifyRes.json()) as {
    success: boolean;
    data: {
      id: string;
      type: string;
      target: string;
    };
  };

  expect(verifyRes.status).toBe(200);
  expect(verifyBody).toMatchObject({
    success: true,
    data: {
      id: expect.any(String),
      type: 'onboarding',
      target: 'test@example.com',
    },
  });

  // verify the record was deleted
  const verifications = await db.query.verifications.findMany({
    where: eq(schema.verifications.id, verifyBody.data.id),
  });

  expect(verifications).toHaveLength(0);

  await teardown();
});

test('it handles invalid code', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/verify-code', {
    method: 'POST',
    body: JSON.stringify({
      type: 'onboarding',
      target: 'test@example.com',
      code: 'INVALID',
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: false,
    error: 'Invalid verification code',
  });

  await teardown();
});

test('it handles expired codes', async () => {
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
    expiresAt: new Date(Date.now() - 1000),
    createdAt: new Date(),
  } as const;

  await db.insert(schema.verifications).values(verification);

  const req = new Request('http://localhost/verify-code', {
    method: 'POST',
    body: JSON.stringify({
      type: 'onboarding',
      target: 'test@example.com',
      code: verification.secret,
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: false,
    error: 'Verification code has expired',
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

  const req = new Request('http://localhost/verify-code', {
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
