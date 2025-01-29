import { http, HttpResponse } from 'msw';

export const ENDPOINT_URL = `https://api.resend.com/emails`;

export const resendEmails = http.post(ENDPOINT_URL, async () => {
  return HttpResponse.json({ success: true, data: {} });
});
