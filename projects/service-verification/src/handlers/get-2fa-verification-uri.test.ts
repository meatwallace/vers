import { expect, test } from 'vitest';
import { createId } from '@paralleldrive/cuid2';
import * as schema from '@vers/postgres-schema';
import { PostgresTestUtils } from '@vers/service-test-utils';
import { Hono } from 'hono';
import { pgTestConfig } from '../pg-test-config';
import { get2FAVerificationURI } from './get-2fa-verification-uri';

async function setupTest() {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  app.post('/get-2fa-verification-uri', async (ctx) =>
    get2FAVerificationURI(ctx, db),
  );

  return { app, db, teardown };
}

test('it returns a TOTP auth URI for a valid 2FA verification record', async () => {
  const { app, db, teardown } = await setupTest();

  const verification = {
    algorithm: 'SHA-1',
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
    createdAt: new Date(),
    digits: 6,
    expiresAt: null,
    id: createId(),
    period: 30,
    secret: 'ABCDEFGHIJKLMNOP',
    target: 'test@example.com',
    type: '2fa-setup',
  } as const;

  await db.insert(schema.verifications).values(verification);

  const req = new Request('http://localhost/get-2fa-verification-uri', {
    body: JSON.stringify({
      target: 'test@example.com',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: {
      otpURI: expect.stringContaining('otpauth://totp/vers:test%40example.com'),
    },
    success: true,
  });

  await teardown();
});

test('it returns an error for non-existent 2FA verification record', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/get-2fa-verification-uri', {
    body: JSON.stringify({
      target: 'test@example.com',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    error: 'No 2FA verification found for this target',
    success: false,
  });

  await teardown();
});

test('it handles an invalid request body', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/get-2fa-verification-uri', {
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
