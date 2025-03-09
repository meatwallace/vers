import { http, HttpResponse } from 'msw';
import { VerifyCodeRequest } from '@chrono/service-types';
import { verifyTOTP } from '@epic-web/totp';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.VERIFICATIONS_SERVICE_URL}verify-code`;

export const verifyCode = http.post<never, VerifyCodeRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    const body = await request.json();

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

    if (verification.expiresAt && verification.expiresAt < new Date()) {
      db.verification.delete({
        where: {
          id: { equals: verification.id },
        },
      });

      return HttpResponse.json({
        success: false,
        error: 'Verification code has expired',
      });
    }

    const isValid = await verifyTOTP({
      otp: body.code,
      secret: verification.secret,
      algorithm: verification.algorithm,
      period: verification.period,
      digits: verification.digits,
      charSet: verification.charSet,
    });

    if (!isValid) {
      return HttpResponse.json({
        success: false,
        error: 'Invalid verification code',
      });
    }

    // Delete the verification after successful use

    db.verification.delete({
      where: {
        id: { equals: verification.id },
      },
    });

    return HttpResponse.json({
      success: true,
      data: {
        id: verification.id,
        type: verification.type,
        target: verification.target,
      },
    });
  },
);
