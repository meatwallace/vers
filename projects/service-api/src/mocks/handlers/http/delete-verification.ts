import {
  DeleteVerificationRequest,
  DeleteVerificationResponse,
} from '@vers/service-types';
import { http, HttpResponse } from 'msw';
import { env } from '~/env.ts';
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
        error: 'Verification not found',
        success: false,
      };

      return HttpResponse.json(response);
    }

    // Delete the verification record
    db.verification.delete({
      where: { id: { equals: body.id } },
    });

    const response: DeleteVerificationResponse = {
      data: { deletedID: verification.id },
      success: true,
    };

    return HttpResponse.json(response);
  },
);
