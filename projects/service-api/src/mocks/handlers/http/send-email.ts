import { http, HttpResponse } from 'msw';
import { SendEmailRequest } from '@chrono/service-types';
import { env } from '~/env';

export const ENDPOINT_URL = `${env.EMAILS_SERVICE_URL}send-email`;

export const sendEmail = http.post<never, SendEmailRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const body = await request.json();

    return HttpResponse.json({ success: true });
  },
);
