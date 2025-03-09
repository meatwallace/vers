import { Context } from 'hono';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import * as schema from '@chrono/postgres-schema';
import {
  DeleteVerificationRequest,
  DeleteVerificationResponse,
} from '@chrono/service-types';

export async function deleteVerification(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { id } = await ctx.req.json<DeleteVerificationRequest>();

    const [verification] = await db
      .delete(schema.verifications)
      .where(eq(schema.verifications.id, id))
      .returning({
        deletedID: schema.verifications.id,
      });

    const response: DeleteVerificationResponse = {
      success: true,
      data: { deletedID: verification.deletedID },
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
