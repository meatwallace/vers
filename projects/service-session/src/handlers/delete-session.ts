import { Context } from 'hono';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@chrono/postgres-schema';
import { and, eq } from 'drizzle-orm';
import {
  DeleteSessionRequest,
  DeleteSessionResponse,
} from '@chrono/service-types';

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
      success: true,
      data: {},
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
