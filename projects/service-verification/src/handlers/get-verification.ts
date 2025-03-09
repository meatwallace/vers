import * as schema from '@vers/postgres-schema';
import {
  GetVerificationRequest,
  GetVerificationResponse,
} from '@vers/service-types';
import { and, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';

export async function getVerification(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { target, type } = await ctx.req.json<GetVerificationRequest>();

    const verification = await db.query.verifications.findFirst({
      where: and(
        eq(schema.verifications.type, type),
        eq(schema.verifications.target, target),
      ),
    });

    if (!verification) {
      const response: GetVerificationResponse = {
        data: null,
        success: true,
      };

      return ctx.json(response);
    }

    // if the verification has expired, delete it and return null
    if (verification.expiresAt && verification.expiresAt < new Date()) {
      await db
        .delete(schema.verifications)
        .where(eq(schema.verifications.id, verification.id));

      const response: GetVerificationResponse = {
        data: null,
        success: true,
      };

      return ctx.json(response);
    }

    const response: GetVerificationResponse = {
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
