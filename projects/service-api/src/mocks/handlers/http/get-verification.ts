import { GetVerificationRequest } from '@vers/service-types';
import { http, HttpResponse } from 'msw';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.VERIFICATIONS_SERVICE_URL}get-verification`;

export const getVerification = http.post<never, GetVerificationRequest>(
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
        data: null,
        success: true,
      });
    }

    if (verification.expiresAt && verification.expiresAt < new Date()) {
      db.verification.delete({
        where: {
          id: { equals: verification.id },
        },
      });

      return HttpResponse.json({
        data: null,
        success: true,
      });
    }

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
