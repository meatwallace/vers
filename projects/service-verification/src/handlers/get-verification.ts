import { Context } from 'hono';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, eq } from 'drizzle-orm';
import * as schema from '@chrono/postgres-schema';
import {
  GetVerificationRequest,
  GetVerificationResponse,
} from '@chrono/service-types';

export async function getVerification(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { type, target } = await ctx.req.json<GetVerificationRequest>();

    const verification = await db.query.verifications.findFirst({
      where: and(
        eq(schema.verifications.type, type),
        eq(schema.verifications.target, target),
      ),
    });

    if (!verification) {
      const response: GetVerificationResponse = {
        success: true,
        data: null,
      };

      return ctx.json(response);
    }

    // if the verification has expired, delete it and return null
    if (verification.expiresAt && verification.expiresAt < new Date()) {
      await db
        .delete(schema.verifications)
        .where(eq(schema.verifications.id, verification.id));

      const response: GetVerificationResponse = {
        success: true,
        data: null,
      };

      return ctx.json(response);
    }

    const response: GetVerificationResponse = {
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
