import { expect, test } from 'vitest';
import * as schema from '@chrono/postgres-schema';
import { PostgresTestUtils } from '@chrono/service-test-utils';
import { CreateVerificationResponse } from '@chrono/service-types';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import invariant from 'tiny-invariant';
import { pgTestConfig } from '../pg-test-config';
import { createVerification } from './create-verification';
import { verifyCode } from './verify-code';

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
    body: JSON.stringify({
      period: 300,
      target: 'test@example.com',
      type: 'onboarding',
    }),
    method: 'POST',
  });

  const createRes = await app.request(createReq);
  const createBody = (await createRes.json()) as CreateVerificationResponse;

  invariant(createBody.success);

  const verifyReq = new Request('http://localhost/verify-code', {
    body: JSON.stringify({
      code: createBody.data.otp,
      target: 'test@example.com',
      type: 'onboarding',
    }),
    method: 'POST',
  });

  const verifyRes = await app.request(verifyReq);
  const verifyBody = (await verifyRes.json()) as {
    data: {
      id: string;
      target: string;
      type: string;
    };
    success: boolean;
  };

  expect(verifyRes.status).toBe(200);
  expect(verifyBody).toMatchObject({
    data: {
      id: expect.any(String),
      target: 'test@example.com',
      type: 'onboarding',
    },
    success: true,
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
    body: JSON.stringify({
      code: 'INVALID',
      target: 'test@example.com',
      type: 'onboarding',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    error: 'Invalid verification code',
    success: false,
  });

  await teardown();
});

test('it handles expired codes', async () => {
  const { app, db, teardown } = await setupTest();

  const verification = {
    algorithm: 'sha1',
    charSet: 'hex',
    createdAt: new Date(),
    digits: 6,
    expiresAt: new Date(Date.now() - 1000),
    id: createId(),
    period: 300,
    secret: 'ABC123',
    target: 'test@example.com',
    type: 'onboarding',
  } as const;

  await db.insert(schema.verifications).values(verification);

  const req = new Request('http://localhost/verify-code', {
    body: JSON.stringify({
      code: verification.secret,
      target: 'test@example.com',
      type: 'onboarding',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    error: 'Verification code has expired',
    success: false,
  });

  // verify the record was deleted
  const verifications = await db.query.verifications.findMany({
    where: eq(schema.verifications.id, verification.id),
  });

  expect(verifications).toHaveLength(0);

  await teardown();
});

test('it does not delete a 2FA verification', async () => {
  const { app, db, teardown } = await setupTest();

  const createReq = new Request('http://localhost/create-verification', {
    body: JSON.stringify({
      target: 'test@example.com',
      type: '2fa-setup',
    }),
    method: 'POST',
  });

  const createRes = await app.request(createReq);
  const createBody = (await createRes.json()) as CreateVerificationResponse;

  invariant(createBody.success);

  const req = new Request('http://localhost/verify-code', {
    body: JSON.stringify({
      code: createBody.data.otp,
      target: 'test@example.com',
      type: '2fa-setup',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
  });

  const verification = await db.query.verifications.findFirst({
    where: eq(schema.verifications.id, createBody.data.id),
  });

  expect(verification).not.toBeUndefined();

  await teardown();
});

test('it does not delete a 2FA disable verification', async () => {
  const { app, db, teardown } = await setupTest();

  const createReq = new Request('http://localhost/create-verification', {
    body: JSON.stringify({
      target: 'test@example.com',
      type: '2fa',
    }),
    method: 'POST',
  });

  const createRes = await app.request(createReq);
  const createBody = (await createRes.json()) as CreateVerificationResponse;

  invariant(createBody.success);

  const req = new Request('http://localhost/verify-code', {
    body: JSON.stringify({
      code: createBody.data.otp,
      target: 'test@example.com',
      type: '2fa',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
  });

  const verification = await db.query.verifications.findFirst({
    where: eq(schema.verifications.id, createBody.data.id),
  });

  expect(verification).not.toBeUndefined();

  await teardown();
});

test('handles an invalid request body', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/verify-code', {
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
