import { afterEach, expect, test } from 'vitest';
import { drop } from '@mswjs/data';
import { SendEmailRequest } from '@vers/service-types';
import { http, HttpResponse } from 'msw';
import { db } from '~/mocks/db';
import { ENDPOINT_URL } from '~/mocks/handlers/http/send-email';
import { server } from '~/mocks/node';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { resolve } from './start-password-reset';

let emailTemplate: null | string = null;

const sendEmailHandler = vi.fn(async ({ request }: { request: Request }) => {
  const body = (await request.json()) as SendEmailRequest;

  emailTemplate = body.html;

  return HttpResponse.json({ success: true });
});

function setupTest() {
  server.use(http.post(ENDPOINT_URL, sendEmailHandler));
}

afterEach(() => {
  emailTemplate = null;

  server.resetHandlers();
  vi.clearAllMocks();

  drop(db);
});

test('it sets a reset token, sends an email then returns success for an existing user', async () => {
  setupTest();

  db.user.create({
    email: 'test@example.com',
    passwordHash: 'hashed_password',
    passwordResetToken: null,
    passwordResetTokenExpiresAt: null,
  });

  const ctx = createMockGQLContext({});

  const args = {
    input: {
      email: 'test@example.com',
    },
  };

  const result = await resolve({}, args, ctx);

  const user = db.user.findFirst({
    where: {
      email: { equals: 'test@example.com' },
    },
  });

  expect(user?.passwordResetToken).toBeDefined();
  expect(user?.passwordResetTokenExpiresAt).toBeDefined();

  expect(result).toMatchObject({ success: true });
  expect(sendEmailHandler).toHaveBeenCalled();
  expect(emailTemplate).toContain(
    `http://localhost:4000/reset-password?token=${user?.passwordResetToken}&amp;email=test%40example.com`,
  );
});

test('it directs the user to verify an OTP when 2FA is enabled', async () => {
  setupTest();

  db.user.create({
    email: 'test@example.com',
    passwordHash: 'hashed_password',
    passwordResetToken: null,
    passwordResetTokenExpiresAt: null,
  });

  db.verification.create({
    target: 'test@example.com',
    type: '2fa',
  });

  const ctx = createMockGQLContext({});

  const args = {
    input: {
      email: 'test@example.com',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({ transactionID: expect.any(String) });
  expect(sendEmailHandler).toHaveBeenCalled();
  expect(emailTemplate).toContain(
    'http://localhost:4000/verify-otp?type=RESET_PASSWORD',
  );
});

test('it returns success for non-existent user (to prevent user enumeration)', async () => {
  setupTest();

  const ctx = createMockGQLContext({});

  const args = {
    input: {
      email: 'nonexistent@example.com',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    success: true,
  });

  const verification = db.verification.findFirst({
    where: {
      target: { equals: 'nonexistent@example.com' },
    },
  });

  expect(verification).toBeNull();
});
