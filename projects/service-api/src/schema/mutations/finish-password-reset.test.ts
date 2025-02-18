import { afterEach, expect, test } from 'vitest';
import { drop } from '@mswjs/data';
import { http, HttpResponse } from 'msw';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { db } from '~/mocks/db';
import { server } from '~/mocks/node';
import { ENDPOINT_URL as CHANGE_PASSWORD_ENDPOINT_URL } from '~/mocks/handlers/http/change-password';
import { resolve } from './finish-password-reset';

afterEach(() => {
  drop(db);

  server.resetHandlers();
});

test('it updates the password for a valid verification', async () => {
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

test('it returns a success response for any errors returned from the the change password endpoint', async () => {
  const ctx = createMockGQLContext({});

  server.use(
    http.post(CHANGE_PASSWORD_ENDPOINT_URL, async () => {
      return HttpResponse.json({ success: false });
    }),
  );

  const args = {
    input: {
      email: 'test@example.com',
      password: 'newpassword123',
      resetToken: '123456',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    success: true,
  });
});
