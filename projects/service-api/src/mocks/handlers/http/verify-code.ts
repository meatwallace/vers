import { VerifyCodeRequest } from '@chrono/service-types';
import { verifyTOTP } from '@epic-web/totp';
import { http, HttpResponse } from 'msw';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.VERIFICATIONS_SERVICE_URL}verify-code`;

export const verifyCode = http.post<never, VerifyCodeRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    const body = await request.json();

    const verification = db.verification.findFirst({
      where: {
        target: { equals: body.target },
        type: { equals: body.type },
      },
    });

    if (!verification) {
      return HttpResponse.json({
        error: 'Invalid verification code',
        success: false,
      });
    }

    if (verification.expiresAt && verification.expiresAt < new Date()) {
      db.verification.delete({
        where: {
          id: { equals: verification.id },
        },
      });

      return HttpResponse.json({
        error: 'Verification code has expired',
        success: false,
      });
    }

    const isValid = await verifyTOTP({
      algorithm: verification.algorithm,
      charSet: verification.charSet,
      digits: verification.digits,
      otp: body.code,
      period: verification.period,
      secret: verification.secret,
    });

    if (!isValid) {
      return HttpResponse.json({
        error: 'Invalid verification code',
        success: false,
      });
    }

    // Delete the verification after successful use

    db.verification.delete({
      where: {
        id: { equals: verification.id },
      },
    });

    return HttpResponse.json({
      data: {
        id: verification.id,
        target: verification.target,
        type: verification.type,
      },
      success: true,
    });
  },
);
