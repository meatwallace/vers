import * as schema from '@vers/postgres-schema';
import { GetSessionRequest, GetSessionResponse } from '@vers/service-types';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';

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
      data: session ?? null,
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
