import { and, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';
import { Jsonify } from 'type-fest';
import * as schema from '@chrono/postgres-schema';
import {
  CreateVerificationRequest,
  CreateVerificationResponse,
  VerificationType,
} from '@chrono/service-types';
import { generateTOTP } from '@epic-web/totp';
import { createId } from '@paralleldrive/cuid2';

// alphanumeirc excluding 0, O, and I on purpose to avoid confusing users
const TOTP_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789';

// standard charset used by 2FA apps
const TWO_FACTOR_CHARSET = '0123456789';

const VERIFICATION_TYPE_TO_CHARSET: Record<VerificationType, string> = {
  '2fa-setup': TWO_FACTOR_CHARSET,
  '2fa': TWO_FACTOR_CHARSET,
  onboarding: TOTP_CHARSET,
  'change-email': TOTP_CHARSET,
};

export async function createVerification(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { type, target, period, expiresAt } =
      await ctx.req.json<Jsonify<CreateVerificationRequest>>();

    // delete any existing verifications for this target and type to invalidate previous codes
    await db
      .delete(schema.verifications)
      .where(
        and(
          eq(schema.verifications.target, target),
          eq(schema.verifications.type, type),
        ),
      );

    const { otp, ...verificationConfig } = await generateTOTP({
      algorithm: 'SHA-256',
      charSet: VERIFICATION_TYPE_TO_CHARSET[type],
      period,
    });

    const verification: typeof schema.verifications.$inferSelect = {
      id: createId(),
      type,
      target,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdAt: new Date(),
      ...verificationConfig,
    };

    await db.insert(schema.verifications).values(verification);

    const response: CreateVerificationResponse = {
      success: true,
      data: {
        otp,
        id: verification.id,
        type: verification.type,
        target: verification.target,
      },
    };

    return ctx.json(response);
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      const response = {
        success: false,
        error: 'An unknown error occurred',
      };

      return ctx.json(response);
    }

    throw error;
  }
}
