import { http, HttpResponse } from 'msw';
import {
  UpdateVerificationRequest,
  UpdateVerificationResponse,
} from '@chrono/service-types';
import { env } from '~/env.ts';
import { omitNullish } from '~/utils/omit-nullish.ts';
import { db } from '../../db.ts';

export const ENDPOINT_URL = `${env.VERIFICATIONS_SERVICE_URL}update-verification`;

export const updateVerification = http.post<never, UpdateVerificationRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    const body = await request.json();
    const { id, ...update } = body;

    const verification = db.verification.findFirst({
      where: { id: { equals: body.id } },
    });

    if (!verification) {
      const response: UpdateVerificationResponse = {
        success: false,
        error: 'Verification not found',
      };

      return HttpResponse.json(response);
    }

    const updatedVerification = db.verification.update({
      where: { id: { equals: id } },
      data: omitNullish(update),
    });

    if (!updatedVerification) {
      const response: UpdateVerificationResponse = {
        success: false,
        error: 'Failed to update verification',
      };

      return HttpResponse.json(response);
    }

    const response = {
      success: true,
      data: {
        id: updatedVerification.id,
        type: updatedVerification.type,
        target: updatedVerification.target,
      },
    };

    return HttpResponse.json(response);
  },
);
