import { expect, test } from 'vitest';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import * as schema from '@chrono/postgres-schema';
import { PostgresTestUtils } from '@chrono/service-test-utils';
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
    method: 'POST',
    body: JSON.stringify({
      type: 'onboarding',
      target: 'test@example.com',
      period: 5 * 60, // 5 minutes
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: {
      id: expect.any(String),
      type: 'onboarding',
      target: 'test@example.com',
      otp: expect.any(String),
    },
  });

  const verification = await db.query.verifications.findFirst({
    where: and(
      eq(schema.verifications.target, 'test@example.com'),
      eq(schema.verifications.type, 'onboarding'),
    ),
  });

  expect(verification).toMatchObject({
    target: 'test@example.com',
    type: 'onboarding',
    secret: expect.any(String),
    algorithm: 'SHA-256',
    digits: 6,
    period: 300,
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
    expiresAt: null,
    createdAt: expect.any(Date),
  });

  await teardown();
});

test('it uses a simple charset for 2fa verification codes', async () => {
  const { app, db, teardown } = await setupTest();

  const req = new Request('http://localhost/create-verification', {
    method: 'POST',
    body: JSON.stringify({
      type: '2fa',
      target: 'test@example.com',
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: {
      id: expect.any(String),
      type: '2fa',
      target: 'test@example.com',
      otp: expect.any(String),
    },
  });

  const verification = await db.query.verifications.findFirst({
    where: and(
      eq(schema.verifications.target, 'test@example.com'),
      eq(schema.verifications.type, '2fa'),
    ),
  });

  expect(verification).toMatchObject({
    target: 'test@example.com',
    type: '2fa',
    secret: expect.any(String),
    algorithm: 'SHA-256',
    digits: 6,
    period: 30,
    charSet: '0123456789',
    expiresAt: null,
    createdAt: expect.any(Date),
  });

  await teardown();
});

test('it uses a simple charset for 2fa setup verification codes', async () => {
  const { app, db, teardown } = await setupTest();

  const req = new Request('http://localhost/create-verification', {
    method: 'POST',
    body: JSON.stringify({
      type: '2fa-setup',
      target: 'test@example.com',
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: {
      id: expect.any(String),
      type: '2fa-setup',
      target: 'test@example.com',
      otp: expect.any(String),
    },
  });

  const verification = await db.query.verifications.findFirst({
    where: and(
      eq(schema.verifications.target, 'test@example.com'),
      eq(schema.verifications.type, '2fa-setup'),
    ),
  });

  expect(verification).toMatchObject({
    target: 'test@example.com',
    type: '2fa-setup',
    secret: expect.any(String),
    algorithm: 'SHA-256',
    digits: 6,
    period: 30,
    charSet: '0123456789',
    expiresAt: null,
    createdAt: expect.any(Date),
  });

  await teardown();
});

test('replaces existing verification for same target and type', async () => {
  const { app, db, teardown } = await setupTest();

  const req1 = new Request('http://localhost/create-verification', {
    method: 'POST',
    body: JSON.stringify({
      type: 'onboarding',
      target: 'test@example.com',
      period: 300,
    }),
  });

  await app.request(req1);

  const req2 = new Request('http://localhost/create-verification', {
    method: 'POST',
    body: JSON.stringify({
      type: 'onboarding',
      target: 'test@example.com',
      period: 300,
    }),
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

test('creates a verification with explicit expiry time', async () => {
  const { app, db, teardown } = await setupTest();

  const now = Date.now();

  const req = new Request('http://localhost/create-verification', {
    method: 'POST',
    body: JSON.stringify({
      type: 'onboarding',
      target: 'test@example.com',
      expiresAt: new Date(now + 10 * 60 * 1000),
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: {
      id: expect.any(String),
      type: 'onboarding',
      target: 'test@example.com',
      otp: expect.any(String),
    },
  });

  const verification = await db.query.verifications.findFirst({
    where: and(
      eq(schema.verifications.target, 'test@example.com'),
      eq(schema.verifications.type, 'onboarding'),
    ),
  });

  expect(verification).not.toBeUndefined();
  expect(verification).toMatchObject({
    target: 'test@example.com',
    type: 'onboarding',
    expiresAt: new Date(now + 10 * 60 * 1000),
  });

  await teardown();
});
