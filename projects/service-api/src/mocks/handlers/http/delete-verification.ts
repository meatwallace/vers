import { http, HttpResponse } from 'msw';
import { env } from '~/env.ts';
import {
  DeleteVerificationRequest,
  DeleteVerificationResponse,
} from '@chrono/service-types';
import { db } from '../../db.ts';

const ENDPOINT_URL = `${env.VERIFICATIONS_SERVICE_URL}delete-verification`;

export const deleteVerification = http.post<never, DeleteVerificationRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    const body = await request.json();

    const verification = db.verification.findFirst({
      where: { id: { equals: body.id } },
    });

    if (!verification) {
      const response: DeleteVerificationResponse = {
        success: false,
        error: 'Verification not found',
      };

      return HttpResponse.json(response);
    }

    // Delete the verification record
    db.verification.delete({
      where: { id: { equals: body.id } },
    });

    const response: DeleteVerificationResponse = {
      success: true,
      data: { deletedID: verification.id },
    };

    return HttpResponse.json(response);
  },
);
