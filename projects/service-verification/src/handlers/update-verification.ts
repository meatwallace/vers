import { Context } from 'hono';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import * as schema from '@chrono/postgres-schema';
import {
  UpdateVerificationRequest,
  UpdateVerificationResponse,
} from '@chrono/service-types';

export async function updateVerification(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { id, ...update } = await ctx.req.json<UpdateVerificationRequest>();

    const [verification] = await db
      .update(schema.verifications)
      .set(update)
      .where(eq(schema.verifications.id, id))
      .returning({
        updatedID: schema.verifications.id,
      });

    const response: UpdateVerificationResponse = {
      success: true,
      data: {
        updatedID: verification.updatedID,
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
