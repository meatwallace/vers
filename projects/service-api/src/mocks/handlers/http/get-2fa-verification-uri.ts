import { HttpResponse, http } from 'msw';
import { Get2FAVerificationURIRequest } from '@chrono/service-types';
import { getTOTPAuthUri } from '@epic-web/totp';
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
      type: { equals: '2fa-setup' },
      target: { equals: body.target },
    },
  });

  if (!verification) {
    return HttpResponse.json({
      success: false,
      error: 'No 2FA verification found for this target',
    });
  }

  const otpURI = getTOTPAuthUri({
    secret: verification.secret,
    algorithm: verification.algorithm,
    digits: verification.digits,
    period: verification.period,
    accountName: body.target,
    issuer: 'Chrononomicon',
  });

  return HttpResponse.json({
    success: true,
    data: {
      otpURI,
    },
  });
});
