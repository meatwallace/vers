import {
  UpdateVerificationRequest,
  UpdateVerificationResponse,
} from '@chrono/service-types';
import { http, HttpResponse } from 'msw';
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
        error: 'Verification not found',
        success: false,
      };

      return HttpResponse.json(response);
    }

    const updatedVerification = db.verification.update({
      data: omitNullish(update),
      where: { id: { equals: id } },
    });

    if (!updatedVerification) {
      const response: UpdateVerificationResponse = {
        error: 'Failed to update verification',
        success: false,
      };

      return HttpResponse.json(response);
    }

    const response = {
      data: {
        id: updatedVerification.id,
        target: updatedVerification.target,
        type: updatedVerification.type,
      },
      success: true,
    };

    return HttpResponse.json(response);
  },
);
