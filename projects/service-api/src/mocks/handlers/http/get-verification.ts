import { http, HttpResponse } from 'msw';
import { GetVerificationRequest } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.VERIFICATIONS_SERVICE_URL}get-verification`;

export const getVerification = http.post<never, GetVerificationRequest>(
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
        success: true,
        data: null,
      });
    }

    if (verification.expiresAt && verification.expiresAt < new Date()) {
      db.verification.delete({
        where: {
          id: { equals: verification.id },
        },
      });

      return HttpResponse.json({
        success: true,
        data: null,
      });
    }

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
