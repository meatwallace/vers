import { http, HttpResponse } from 'msw';
import { SendEmailRequest } from '@chrono/service-types';
import { env } from '~/env';

export const ENDPOINT_URL = `${env.EMAILS_SERVICE_URL}send-email`;

export const sendEmail = http.post(ENDPOINT_URL, async ({ request }) => {
  const body = (await request.json()) as SendEmailRequest;

  if (!body.to || !body.subject || !body.html || !body.plainText) {
    return new HttpResponse(null, { status: 400 });
  }

  return HttpResponse.json({ success: true });
});
