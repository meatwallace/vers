import { Context } from 'hono';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { generateTOTP } from '@epic-web/totp';
import { eq, and } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import * as schema from '@chrono/postgres-schema';
import {
  CreateVerificationRequest,
  CreateVerificationResponse,
} from '@chrono/service-types';

// alphanumeirc excluding 0, O, and I on purpose to avoid confusing users
const TOTP_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789';

export async function createVerification(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { type, target, period } =
      await ctx.req.json<CreateVerificationRequest>();

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
      charSet: TOTP_CHARSET,
      period,
    });

    const verification: typeof schema.verifications.$inferSelect = {
      id: createId(),
      type,
      target,
      expiresAt: new Date(Date.now() + verificationConfig.period * 1000),
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
