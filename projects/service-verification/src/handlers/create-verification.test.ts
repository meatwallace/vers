import { expect, test } from 'vitest';
import * as schema from '@vers/postgres-schema';
import { PostgresTestUtils } from '@vers/service-test-utils';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { pgTestConfig } from '../pg-test-config';
import { createVerification } from './create-verification';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  app.post('/create-verification', async (ctx) => createVerification(ctx, db));

  return { app, db, teardown };
}

test('creates a verification code and stores a record of it', async () => {
  const { app, db, teardown } = await setupTest();

  const req = new Request('http://localhost/create-verification', {
    body: JSON.stringify({
      period: 5 * 60, // 5 minutes
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
      id: expect.any(String),
      otp: expect.any(String),
      target: 'test@example.com',
      type: 'onboarding',
    },
    success: true,
  });

  const verification = await db.query.verifications.findFirst({
    where: and(
      eq(schema.verifications.target, 'test@example.com'),
      eq(schema.verifications.type, 'onboarding'),
    ),
  });

  expect(verification).toMatchObject({
    algorithm: 'SHA-256',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
    createdAt: expect.any(Date),
    digits: 6,
    expiresAt: null,
    period: 300,
    secret: expect.any(String),
    target: 'test@example.com',
    type: 'onboarding',
  });

  await teardown();
});

test('it uses a simple charset for 2fa verification codes', async () => {
  const { app, db, teardown } = await setupTest();

  const req = new Request('http://localhost/create-verification', {
    body: JSON.stringify({
      target: 'test@example.com',
      type: '2fa',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: {
      id: expect.any(String),
      otp: expect.any(String),
      target: 'test@example.com',
      type: '2fa',
    },
    success: true,
  });

  const verification = await db.query.verifications.findFirst({
    where: and(
      eq(schema.verifications.target, 'test@example.com'),
      eq(schema.verifications.type, '2fa'),
    ),
  });

  expect(verification).toMatchObject({
    algorithm: 'SHA-256',
    charSet: '0123456789',
    createdAt: expect.any(Date),
    digits: 6,
    expiresAt: null,
    period: 30,
    secret: expect.any(String),
    target: 'test@example.com',
    type: '2fa',
  });

  await teardown();
});

test('it uses a simple charset for 2fa setup verification codes', async () => {
  const { app, db, teardown } = await setupTest();

  const req = new Request('http://localhost/create-verification', {
    body: JSON.stringify({
      target: 'test@example.com',
      type: '2fa-setup',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: {
      id: expect.any(String),
      otp: expect.any(String),
      target: 'test@example.com',
      type: '2fa-setup',
    },
    success: true,
  });

  const verification = await db.query.verifications.findFirst({
    where: and(
      eq(schema.verifications.target, 'test@example.com'),
      eq(schema.verifications.type, '2fa-setup'),
    ),
  });

  expect(verification).toMatchObject({
    algorithm: 'SHA-256',
    charSet: '0123456789',
    createdAt: expect.any(Date),
    digits: 6,
    expiresAt: null,
    period: 30,
    secret: expect.any(String),
    target: 'test@example.com',
    type: '2fa-setup',
  });

  await teardown();
});

test('replaces existing verification for same target and type', async () => {
  const { app, db, teardown } = await setupTest();

  const req1 = new Request('http://localhost/create-verification', {
    body: JSON.stringify({
      period: 300,
      target: 'test@example.com',
      type: 'onboarding',
    }),
    method: 'POST',
  });

  await app.request(req1);

  const req2 = new Request('http://localhost/create-verification', {
    body: JSON.stringify({
      period: 300,
      target: 'test@example.com',
      type: 'onboarding',
    }),
    method: 'POST',
  });

  await app.request(req2);

  const verifications = await db.query.verifications.findMany({
    where: and(
      eq(schema.verifications.type, 'onboarding'),
      eq(schema.verifications.target, 'test@example.com'),
    ),
  });

  expect(verifications).toHaveLength(1);

  await teardown();
});

test('handles an invalid request body', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/create-verification', {
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

test('creates a verification with explicit expiry time', async () => {
  const { app, db, teardown } = await setupTest();

  const now = Date.now();

  const req = new Request('http://localhost/create-verification', {
    body: JSON.stringify({
      expiresAt: new Date(now + 10 * 60 * 1000),
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
      id: expect.any(String),
      otp: expect.any(String),
      target: 'test@example.com',
      type: 'onboarding',
    },
    success: true,
  });

  const verification = await db.query.verifications.findFirst({
    where: and(
      eq(schema.verifications.target, 'test@example.com'),
      eq(schema.verifications.type, 'onboarding'),
    ),
  });

  expect(verification).not.toBeUndefined();
  expect(verification).toMatchObject({
    expiresAt: new Date(now + 10 * 60 * 1000),
    target: 'test@example.com',
    type: 'onboarding',
  });

  await teardown();
});
