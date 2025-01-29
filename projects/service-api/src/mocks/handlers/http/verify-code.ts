import { http, HttpResponse } from 'msw';
import { VerifyCodeRequest } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.VERIFICATIONS_SERVICE_URL}verify-code`;

export const verifyCode = http.post(ENDPOINT_URL, async ({ request }) => {
  const body = (await request.json()) as VerifyCodeRequest;

  if (!body.type || !body.target || !body.code) {
    return new HttpResponse(null, { status: 400 });
  }

  const verification = db.verification.findFirst({
    where: {
      type: { equals: body.type },
      target: { equals: body.target },
    },
  });

  if (!verification) {
    return HttpResponse.json({
      success: false,
      error: 'Invalid verification code',
    });
  }

  if (verification.expiresAt < new Date()) {
    return HttpResponse.json({
      success: false,
      error: 'Verification code has expired',
    });
  }

  // in the mock, we'll verify any code that starts with 999
  if (!body.code.startsWith('999')) {
    return HttpResponse.json({
      success: false,
      error: 'Invalid verification code',
    });
  }

  return HttpResponse.json({
    success: true,
    data: {
      type: verification.type,
      target: verification.target,
    },
  });
});
