import { eq } from 'drizzle-orm';
import { Context } from 'hono';
import * as schema from '@chrono/postgres-schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { GetSessionsRequest, GetSessionsResponse } from '@chrono/service-types';

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
      success: true,
      data: sessions,
    };

    return ctx.json(response);
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      return ctx.json({ success: false, error: 'An unknown error occurred' });
    }

    throw error;
  }
}
