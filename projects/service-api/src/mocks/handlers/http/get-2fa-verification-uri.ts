import { Get2FAVerificationURIRequest } from '@chrono/service-types';
import { getTOTPAuthUri } from '@epic-web/totp';
import { http, HttpResponse } from 'msw';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.VERIFICATIONS_SERVICE_URL}get-2fa-verification-uri`;

export const get2FAVerificationURI = http.post<
  never,
  Get2FAVerificationURIRequest
>(ENDPOINT_URL, async ({ request }) => {
  const body = await request.json();

  const verification = db.verification.findFirst({
    where: {
      target: { equals: body.target },
      type: { equals: '2fa-setup' },
    },
  });

  if (!verification) {
    return HttpResponse.json({
      error: 'No 2FA verification found for this target',
      success: false,
    });
  }

  const otpURI = getTOTPAuthUri({
    accountName: body.target,
    algorithm: verification.algorithm,
    digits: verification.digits,
    issuer: 'Chrononomicon',
    period: verification.period,
    secret: verification.secret,
  });

  return HttpResponse.json({
    data: {
      otpURI,
    },
    success: true,
  });
});
