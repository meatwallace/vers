import { expect, test } from 'vitest';
import { Hono } from 'hono';
import { http, HttpResponse } from 'msw';
import { ENDPOINT_URL as RESEND_EMAIL_ENDPOINT_URL } from '~/mocks/handlers/http/resend-emails.ts';
import { server } from '~/mocks/node.ts';
import { sendEmail } from './send-email';

function setupTest() {
  const app = new Hono();

  app.post('/send-email', sendEmail);

  return { app };
}

afterEach(() => {
  server.resetHandlers();
});

test('it successfully sends an email', async () => {
  const { app } = setupTest();

  const email = {
    html: '<p>Test content</p>',
    plainText: 'Test content',
    subject: 'Test Subject',
    to: 'test@example.com',
  };

  const req = new Request('http://localhost/send-email', {
    body: JSON.stringify(email),
    method: 'POST',
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({ success: true });
});

test('it handles Resend errors', async () => {
  server.use(
    http.post(RESEND_EMAIL_ENDPOINT_URL, () => {
      return HttpResponse.error();
    }),
  );

  const { app } = setupTest();

  const email = {
    html: '<p>Test content</p>',
    plainText: 'Test content',
    subject: 'Test Subject',
    to: 'test@example.com',
  };

  const req = new Request('http://localhost/send-email', {
    body: JSON.stringify(email),
    method: 'POST',
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    error: 'Failed to send email',
    success: false,
  });
});

test('handles an invalid request body', async () => {
  const { app } = setupTest();

  const req = new Request('http://localhost/send-email', {
    body: 'invalid json',
    method: 'POST',
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    error: 'An unknown error occurred',
    success: false,
  });
});
