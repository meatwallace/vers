import { http, HttpResponse } from 'msw';
import { CreateVerificationRequest } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.VERIFICATIONS_SERVICE_URL}create-verification`;

export const createVerification = http.post(
  ENDPOINT_URL,
  async ({ request }) => {
    const data = (await request.json()) as CreateVerificationRequest;

    const verification = db.verification.create({
      type: data.type,
      target: data.target,

      // 5 minutes
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const otp = Date.now().toString().slice(0, 6);

    return HttpResponse.json({
      success: true,
      data: {
        otp,
        type: verification.type,
        target: verification.target,
      },
    });
  },
);
