import * as schema from '@vers/postgres-schema';
import {
  DeleteVerificationRequest,
  DeleteVerificationResponse,
} from '@vers/service-types';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';

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
      data: { deletedID: verification.deletedID },
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
