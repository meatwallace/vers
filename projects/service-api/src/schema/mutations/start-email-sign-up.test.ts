import { HttpResponse, http } from 'msw';
import { SendEmailRequest } from '@chrono/service-types';
import { drop } from '@mswjs/data';
import { db } from '~/mocks/db';
import { ENDPOINT_URL } from '~/mocks/handlers/http/send-email';
import { server } from '~/mocks/node';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { resolve } from './start-email-sign-up';

let emailSubject: string | null = null;
let emailTemplate: string | null = null;

const sendEmailHandler = vi.fn(async ({ request }: { request: Request }) => {
  const body = (await request.json()) as SendEmailRequest;

  emailSubject = body.subject;
  emailTemplate = body.html;

  return HttpResponse.json({ success: true });
});

function setupTest() {
  server.use(http.post(ENDPOINT_URL, sendEmailHandler));
}

afterEach(() => {
  emailSubject = null;
  emailTemplate = null;

  server.resetHandlers();
  vi.clearAllMocks();

  drop(db);
});

test('it creates a verification code and sends an email to the user', async () => {
  setupTest();

  const ctx = createMockGQLContext({});
  const args = {
    input: {
      email: 'user@test.com',
    },
  };

  const result = await resolve({}, args, ctx);

  const verification = db.verification.findFirst({
    where: {
      type: { equals: 'onboarding' },
      target: { equals: 'user@test.com' },
    },
  });

  expect(verification).not.toBeNull();
  expect(sendEmailHandler).toHaveBeenCalled();
  expect(emailTemplate).toContain('http://localhost:4000/verify-otp');
  expect(result).toMatchObject({
    transactionID: expect.any(String),
    sessionID: null,
  });
});

test('it notifies an existing user that they have an account and returns success', async () => {
  setupTest();

  db.user.create({
    email: 'user@test.com',
    name: 'Test User',
    username: 'test_user',
  });

  const ctx = createMockGQLContext({});

  const args = {
    input: {
      email: 'user@test.com',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(sendEmailHandler).toHaveBeenCalled();
  expect(emailSubject).toContain('You already have an account!');
  expect(result).toMatchObject({
    transactionID: expect.any(String),
    sessionID: null,
  });
});
