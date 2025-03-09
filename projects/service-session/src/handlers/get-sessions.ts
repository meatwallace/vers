import * as schema from '@chrono/postgres-schema';
import { GetSessionsRequest, GetSessionsResponse } from '@chrono/service-types';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';

export async function getSessions(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { userID } = await ctx.req.json<GetSessionsRequest>();

    const sessions = await db.query.sessions.findMany({
      where: eq(schema.sessions.userID, userID),
    });

    const response: GetSessionsResponse = {
      data: sessions,
      success: true,
    };

    return ctx.json(response);
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      return ctx.json({ error: 'An unknown error occurred', success: false });
    }

    throw error;
  }
}
