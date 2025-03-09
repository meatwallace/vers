import { http, HttpResponse } from 'msw';
import { afterEach, expect, test } from 'vitest';
import { db } from '~/mocks/db';
import { ENDPOINT_URL as CHANGE_PASSWORD_ENDPOINT_URL } from '~/mocks/handlers/http/change-password';
import { server } from '~/mocks/node';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { createPendingTransaction } from '~/utils/create-pending-transaction';
import { createTransactionToken } from '~/utils/create-transaction-token';
import { drop } from '@mswjs/data';
import { VerificationType } from '../types/verification-type';
import { resolve } from './finish-password-reset';

afterEach(() => {
  drop(db);

  server.resetHandlers();
});

test('it updates the password and removes the password reset token', async () => {
  const user = db.user.create({
    email: 'test@example.com',
    passwordHash: 'old_password_hash',
    passwordResetToken: '123456',
    passwordResetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 10),
  });

  const ctx = createMockGQLContext({});

  const args = {
    input: {
      resetToken: '123456',
      email: 'test@example.com',
      password: 'newpassword123',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    success: true,
  });

  const updatedUser = db.user.findFirst({
    where: {
      id: { equals: user.id },
    },
  });

  expect(updatedUser?.passwordHash).toBe('newpassword123');
  expect(updatedUser?.passwordResetToken).toBeNull();
  expect(updatedUser?.passwordResetTokenExpiresAt).toBeNull();
});

test('it returns a success response for non-existent user (to avoid user enumeration)', async () => {
  const ctx = createMockGQLContext({});

  const args = {
    input: {
      resetToken: '123456',
      email: 'nonexistent@example.com',
      password: 'newpassword123',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    success: true,
  });
});

test('it returns success but does not change the password if 2fa is required and the transaction token is invalid', async () => {
  const user = db.user.create({
    email: 'test@example.com',
    passwordHash: 'old_password_hash',
    passwordResetToken: '123456',
    passwordResetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 10),
  });

  db.verification.create({
    type: '2fa',
    target: user.email,
  });

  const ctx = createMockGQLContext({});

  const args = {
    input: {
      resetToken: '123456',
      email: 'test@example.com',
      password: 'newpassword123',
      transactionToken: 'invalid-token',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    success: true,
  });

  const updatedUser = db.user.findFirst({
    where: {
      id: { equals: user.id },
    },
  });

  // Password should not be changed
  expect(updatedUser?.passwordHash).toBe('old_password_hash');
  expect(updatedUser?.passwordResetToken).toBe('123456');
  expect(updatedUser?.passwordResetTokenExpiresAt).toBeDefined();
});

test('it updates the password when 2fa is required and the transaction token is valid', async () => {
  const user = db.user.create({
    email: 'test@example.com',
    passwordHash: 'old_password_hash',
    passwordResetToken: '123456',
    passwordResetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 10),
  });

  db.verification.create({
    type: '2fa',
    target: user.email,
  });

  const ctx = createMockGQLContext({});

  const transactionID = createPendingTransaction({
    target: user.email,
    ipAddress: ctx.ipAddress,
    action: VerificationType.RESET_PASSWORD,
    sessionID: null,
  });

  const transactionToken = await createTransactionToken(
    {
      target: user.email,
      action: VerificationType.RESET_PASSWORD,
      ipAddress: ctx.ipAddress,
      transactionID,
      sessionID: null,
    },
    ctx,
  );

  const args = {
    input: {
      resetToken: '123456',
      email: 'test@example.com',
      password: 'newpassword123',
      transactionToken,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    success: true,
  });

  const updatedUser = db.user.findFirst({
    where: {
      id: { equals: user.id },
    },
  });

  expect(updatedUser?.passwordHash).toBe('newpassword123');
  expect(updatedUser?.passwordResetToken).toBeNull();
  expect(updatedUser?.passwordResetTokenExpiresAt).toBeNull();
});

test('it returns a success response for any errors returned from the change password endpoint', async () => {
  db.user.create({
    email: 'test@example.com',
    passwordHash: 'old_password_hash',
    passwordResetToken: '123456',
    passwordResetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 10),
  });

  const ctx = createMockGQLContext({});

  const changePasswordHandler = vi.fn(() => {
    return HttpResponse.json({ success: false });
  });

  server.use(http.post(CHANGE_PASSWORD_ENDPOINT_URL, changePasswordHandler));

  const args = {
    input: {
      email: 'test@example.com',
      password: 'newpassword123',
      resetToken: '123456',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(changePasswordHandler).toHaveBeenCalled();
  expect(result).toMatchObject({
    success: true,
  });
});
