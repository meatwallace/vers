import { Hono } from 'hono';
import { http, HttpResponse } from 'msw';
import { test, expect } from 'vitest';
import { ENDPOINT_URL as RESEND_EMAIL_ENDPOINT_URL } from '~/mocks/handlers/http/resend-emails.ts';
import { sendEmail } from './send-email';
import { server } from '~/mocks/node.ts';

async function setupTest() {
  const app = new Hono();

  app.post('/send-email', sendEmail);

  return { app };
}

afterEach(() => {
  server.resetHandlers();
});

test('it successfully sends an email', async () => {
  const { app } = await setupTest();

  const email = {
    to: 'test@example.com',
    subject: 'Test Subject',
    html: '<p>Test content</p>',
    plainText: 'Test content',
  };

  const req = new Request('http://localhost/send-email', {
    method: 'POST',
    body: JSON.stringify(email),
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({ success: true });
});

test('it handles Resend errors', async () => {
  server.use(
    http.post(RESEND_EMAIL_ENDPOINT_URL, async () => {
      return HttpResponse.error();
    }),
  );

  const { app } = await setupTest();

  const email = {
    to: 'test@example.com',
    subject: 'Test Subject',
    html: '<p>Test content</p>',
    plainText: 'Test content',
  };

  const req = new Request('http://localhost/send-email', {
    method: 'POST',
    body: JSON.stringify(email),
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    success: false,
    error: 'Failed to send email',
  });
});

test('handles an invalid request body', async () => {
  const { app } = await setupTest();

  const req = new Request('http://localhost/send-email', {
    method: 'POST',
    body: 'invalid json',
  });

  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    success: false,
    error: 'An unknown error occurred',
  });
});
