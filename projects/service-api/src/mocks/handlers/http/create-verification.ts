import { HttpResponse, http } from 'msw';
import { CreateVerificationRequest } from '@chrono/service-types';
import { generateTOTP } from '@epic-web/totp';
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
        type: { equals: body.type },
        target: { equals: body.target },
      },
    });

    const { otp, ...verificationConfig } = await generateTOTP({
      algorithm: 'SHA-256',
      charSet: TOTP_CHARSET,
      period: body.period ?? 300, // default to 5 minutes if not specified
    });

    const verification = db.verification.create({
      type: body.type,
      target: body.target,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      ...verificationConfig,
    });

    return HttpResponse.json({
      success: true,
      data: {
        id: verification.id,
        type: verification.type,
        target: verification.target,
        otp,
      },
    });
  },
);
