import { ServiceID } from '@chrono/service-types';
import { createId } from '@paralleldrive/cuid2';
import { http, HttpResponse } from 'msw';
import { env } from '~/env';
import { ENDPOINT_URL } from '~/mocks/handlers/http/send-email';
import { server } from '~/mocks/node';
import { createServiceContext } from '../utils';
import { sendEmail } from './send-email';

afterEach(() => {
  server.resetHandlers();
});

test('it successfully sends an email', async () => {
  const ctx = createServiceContext({
    apiURL: env.EMAILS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceEmail,
  });

  const args = {
    html: '<p>Test content</p>',
    plainText: 'Test content',
    subject: 'Test Email',
    to: 'test@example.com',
  };

  await expect(sendEmail(args, ctx)).resolves.not.toThrow();
});

test('it throws an error when the email service fails', async () => {
  server.use(
    http.post(ENDPOINT_URL, () => {
      return HttpResponse.json({ success: false });
    }),
  );

  const ctx = createServiceContext({
    apiURL: env.EMAILS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceEmail,
  });

  const args = {
    html: '<p>Test content</p>',
    plainText: 'Test content',
    subject: 'Test Email',
    to: 'test@example.com',
  };

  await expect(sendEmail(args, ctx)).rejects.toThrow(
    'An unknown error occurred',
  );
});
