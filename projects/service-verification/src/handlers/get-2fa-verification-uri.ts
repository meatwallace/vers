import { and, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';
import * as schema from '@chrono/postgres-schema';
import {
  Get2FAVerificationURIRequest,
  Get2FAVerificationURIResponse,
} from '@chrono/service-types';
import { getTOTPAuthUri } from '@epic-web/totp';

export async function get2FAVerificationURI(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { target } = await ctx.req.json<Get2FAVerificationURIRequest>();

    const verification = await db.query.verifications.findFirst({
      where: and(
        eq(schema.verifications.type, '2fa-setup'),
        eq(schema.verifications.target, target),
      ),
    });

    if (!verification) {
      return ctx.json({
        success: false,
        error: 'No 2FA verification found for this target',
      });
    }

    const otpURI = getTOTPAuthUri({
      secret: verification.secret,
      algorithm: verification.algorithm,
      digits: verification.digits,
      period: verification.period,
      accountName: target,
      issuer: 'Chrononomicon',
    });

    const response: Get2FAVerificationURIResponse = {
      success: true,
      data: {
        otpURI,
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
