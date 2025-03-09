import { Context } from 'hono';
import * as schema from '@chrono/postgres-schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { GetSessionRequest, GetSessionResponse } from '@chrono/service-types';

export async function getSession(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { id } = await ctx.req.json<GetSessionRequest>();

    const session = await db.query.sessions.findFirst({
      where: (sessions, { eq }) => eq(sessions.id, id),
    });

    const response: GetSessionResponse = {
      success: true,
      data: session ?? null,
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
