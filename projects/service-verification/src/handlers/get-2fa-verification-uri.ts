import { getTOTPAuthUri } from '@epic-web/totp';
import * as schema from '@vers/postgres-schema';
import {
  Get2FAVerificationURIRequest,
  Get2FAVerificationURIResponse,
} from '@vers/service-types';
import { and, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';

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
        error: 'No 2FA verification found for this target',
        success: false,
      });
    }

    const otpURI = getTOTPAuthUri({
      accountName: target,
      algorithm: verification.algorithm,
      digits: verification.digits,
      issuer: 'vers',
      period: verification.period,
      secret: verification.secret,
    });

    const response: Get2FAVerificationURIResponse = {
      data: {
        otpURI,
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
