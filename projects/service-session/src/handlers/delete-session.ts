import * as schema from '@vers/postgres-schema';
import {
  DeleteSessionRequest,
  DeleteSessionResponse,
} from '@vers/service-types';
import { and, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';

export async function deleteSession(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { id, userID } = await ctx.req.json<DeleteSessionRequest>();

    await db
      .delete(schema.sessions)
      .where(
        and(eq(schema.sessions.id, id), eq(schema.sessions.userID, userID)),
      );

    const response: DeleteSessionResponse = {
      data: {},
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
