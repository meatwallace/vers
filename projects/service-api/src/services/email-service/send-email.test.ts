import { http, HttpResponse } from 'msw';
import { createId } from '@paralleldrive/cuid2';
import { ServiceID } from '@chrono/service-types';
import { server } from '~/mocks/node';
import { createServiceContext } from '../utils';
import { env } from '~/env';
import { ENDPOINT_URL } from '~/mocks/handlers/http/send-email';
import { sendEmail } from './send-email';

afterEach(() => {
  server.resetHandlers();
});

test('it successfully sends an email', async () => {
  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceEmail,
    apiURL: env.EMAILS_SERVICE_URL,
  });

  const args = {
    to: 'test@example.com',
    subject: 'Test Email',
    html: '<p>Test content</p>',
    plainText: 'Test content',
  };

  await expect(sendEmail(args, ctx)).resolves.not.toThrow();
});

test('it throws an error when the email service fails', async () => {
  server.use(
    http.post(ENDPOINT_URL, async () => {
      return HttpResponse.json({ success: false });
    }),
  );

  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceEmail,
    apiURL: env.EMAILS_SERVICE_URL,
  });

  const args = {
    to: 'test@example.com',
    subject: 'Test Email',
    html: '<p>Test content</p>',
    plainText: 'Test content',
  };

  await expect(sendEmail(args, ctx)).rejects.toThrow(
    'An unknown error occurred',
  );
});
