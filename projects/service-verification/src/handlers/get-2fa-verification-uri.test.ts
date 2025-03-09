import { expect, test } from 'vitest';
import { Hono } from 'hono';
import * as schema from '@chrono/postgres-schema';
import { PostgresTestUtils } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
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
    id: createId(),
    type: '2fa-setup',
    target: 'test@example.com',
    secret: 'ABCDEFGHIJKLMNOP',
    algorithm: 'SHA-1',
    digits: 6,
    period: 30,
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
    createdAt: new Date(),
    expiresAt: null,
  } as const;

  await db.insert(schema.verifications).values(verification);

  const req = new Request('http://localhost/get-2fa-verification-uri', {
    method: 'POST',
    body: JSON.stringify({
      target: 'test@example.com',
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: {
      otpURI: expect.stringContaining(
        'otpauth://totp/Chrononomicon:test%40example.com',
      ),
    },
  });

  await teardown();
});

test('it returns an error for non-existent 2FA verification record', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/get-2fa-verification-uri', {
    method: 'POST',
    body: JSON.stringify({
      target: 'test@example.com',
    }),
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    success: false,
    error: 'No 2FA verification found for this target',
  });

  await teardown();
});

test('it handles an invalid request body', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/get-2fa-verification-uri', {
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
