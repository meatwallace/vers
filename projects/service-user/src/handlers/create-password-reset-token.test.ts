import { expect, test } from 'vitest';
import * as schema from '@chrono/postgres-schema';
import { createTestUser, PostgresTestUtils } from '@chrono/service-test-utils';
import { CreatePasswordResetTokenResponse } from '@chrono/service-types';
import { Hono } from 'hono';
import invariant from 'tiny-invariant';
import { pgTestConfig } from '../pg-test-config';
import { createPasswordResetToken } from './create-password-reset-token';

interface TestConfig {
  user?: Partial<typeof schema.users.$inferInsert>;
}

async function setupTest(config: TestConfig = {}) {
  const app = new Hono();

  const { db, teardown } = await PostgresTestUtils.createTestDB(pgTestConfig);

  const user = await createTestUser({ db, user: config.user });

  app.post('/create-password-reset-token', async (ctx) =>
    createPasswordResetToken(ctx, db),
  );

  return { app, db, teardown, user };
}

test('it creates a password reset token for an existing user', async () => {
  const { app, db, teardown, user } = await setupTest();

  const req = new Request('http://localhost/create-password-reset-token', {
    body: JSON.stringify({
      id: user.id,
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = (await res.json()) as CreatePasswordResetTokenResponse;

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    data: {
      resetToken: expect.any(String),
    },
    success: true,
  });

  const updatedUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, user.id),
  });

  invariant(body.success, 'response has data if success is true');

  expect(updatedUser?.passwordResetToken).toBe(body.data.resetToken);
  expect(updatedUser?.passwordResetTokenExpiresAt).toBeDate();
  expect(updatedUser?.passwordResetTokenExpiresAt).toBeAfter(new Date());
  expect(updatedUser?.passwordResetTokenExpiresAt).toBeBefore(
    new Date(Date.now() + 11 * 60 * 1000),
  );

  await teardown();
});

test('it updates the user record with the new reset token', async () => {
  const { app, db, teardown, user } = await setupTest();

  const firstReq = new Request('http://localhost/create-password-reset-token', {
    body: JSON.stringify({
      id: user.id,
    }),
    method: 'POST',
  });

  const firstRes = await app.request(firstReq);
  const firstBody = (await firstRes.json()) as CreatePasswordResetTokenResponse;

  invariant(firstBody.success, 'response has data if success is true');

  const secondReq = new Request(
    'http://localhost/create-password-reset-token',
    {
      body: JSON.stringify({
        id: user.id,
      }),
      method: 'POST',
    },
  );

  const secondRes = await app.request(secondReq);
  const secondBody =
    (await secondRes.json()) as CreatePasswordResetTokenResponse;

  invariant(secondBody.success, 'response has data if success is true');

  expect(firstBody.data.resetToken).not.toBe(secondBody.data.resetToken);

  const updatedUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, user.id),
  });

  expect(updatedUser?.passwordResetToken).toBe(secondBody.data.resetToken);

  await teardown();
});

test('it returns an error if the user does not exist', async () => {
  const { app, teardown } = await setupTest();

  const req = new Request('http://localhost/create-password-reset-token', {
    body: JSON.stringify({
      id: 'nonexistent_id',
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    error: 'User not found',
    success: false,
  });

  await teardown();
});

test('it returns an error if the user has no password', async () => {
  const { app, teardown, user } = await setupTest({
    user: {
      passwordHash: null,
    },
  });

  const req = new Request('http://localhost/create-password-reset-token', {
    body: JSON.stringify({
      id: user.id,
    }),
    method: 'POST',
  });

  const res = await app.request(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    error: 'User has no password',
    success: false,
  });

  await teardown();
});
