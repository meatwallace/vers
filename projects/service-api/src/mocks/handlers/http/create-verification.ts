import { generateTOTP } from '@epic-web/totp';
import { CreateVerificationRequest } from '@vers/service-types';
import { http, HttpResponse } from 'msw';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.VERIFICATIONS_SERVICE_URL}create-verification`;

// alphanumeric excluding 0, O, and I to avoid confusion
const TOTP_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789';

export const createVerification = http.post<never, CreateVerificationRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    const body = await request.json();

    // Delete any existing verification for this target and type
    db.verification.deleteMany({
      where: {
        target: { equals: body.target },
        type: { equals: body.type },
      },
    });

    const { otp, ...verificationConfig } = await generateTOTP({
      algorithm: 'SHA-256',
      charSet: TOTP_CHARSET,
      period: body.period ?? 300, // default to 5 minutes if not specified
    });

    const verification = db.verification.create({
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      target: body.target,
      type: body.type,
      ...verificationConfig,
    });

    return HttpResponse.json({
      data: {
        id: verification.id,
        otp,
        target: verification.target,
        type: verification.type,
      },
      success: true,
    });
  },
);
