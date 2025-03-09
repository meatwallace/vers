import * as schema from '@chrono/postgres-schema';
import { VerifyCodeRequest, VerifyCodeResponse } from '@chrono/service-types';
import { verifyTOTP } from '@epic-web/totp';
import { and, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';

export async function verifyCode(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { code, target, type } = await ctx.req.json<VerifyCodeRequest>();

    const verification = await db.query.verifications.findFirst({
      where: and(
        eq(schema.verifications.type, type),
        eq(schema.verifications.target, target),
      ),
    });

    if (!verification) {
      return ctx.json({
        error: 'Invalid verification code',
        success: false,
      });
    }

    if (verification.expiresAt && verification.expiresAt < new Date()) {
      await db
        .delete(schema.verifications)
        .where(eq(schema.verifications.id, verification.id));

      return ctx.json({
        error: 'Verification code has expired',
        success: false,
      });
    }

    const result = await verifyTOTP({
      otp: code,
      ...verification,
    });

    if (!result) {
      return ctx.json({
        error: 'Invalid verification code',
        success: false,
      });
    }

    const is2FAVerification =
      verification.type === '2fa-setup' || verification.type === '2fa';

    if (!is2FAVerification) {
      await db
        .delete(schema.verifications)
        .where(eq(schema.verifications.id, verification.id));
    }

    const response: VerifyCodeResponse = {
      data: {
        id: verification.id,
        target: verification.target,
        type: verification.type,
      },
      success: true,
    };

    return ctx.json(response);
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      const response = {
        error: 'An unknown error occurred',
        success: false,
      };

      return ctx.json(response);
    }

    throw error;
  }
}
