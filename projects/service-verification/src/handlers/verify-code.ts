import { Context } from 'hono';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, eq } from 'drizzle-orm';
import { verifyTOTP } from '@epic-web/totp';
import * as schema from '@chrono/postgres-schema';
import { VerifyCodeRequest, VerifyCodeResponse } from '@chrono/service-types';

export async function verifyCode(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { type, target, code } = await ctx.req.json<VerifyCodeRequest>();

    const verification = await db.query.verifications.findFirst({
      where: and(
        eq(schema.verifications.type, type),
        eq(schema.verifications.target, target),
      ),
    });

    if (!verification) {
      return ctx.json({
        success: false,
        error: 'Invalid verification code',
      });
    }

    if (verification.expiresAt < new Date()) {
      await db
        .delete(schema.verifications)
        .where(eq(schema.verifications.id, verification.id));

      return ctx.json({
        success: false,
        error: 'Verification code has expired',
      });
    }

    const result = await verifyTOTP({
      otp: code,
      ...verification,
    });

    if (!result) {
      return ctx.json({
        success: false,
        error: 'Invalid verification code',
      });
    }

    await db
      .delete(schema.verifications)
      .where(eq(schema.verifications.id, verification.id));

    const response: VerifyCodeResponse = {
      success: true,
      data: {
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
