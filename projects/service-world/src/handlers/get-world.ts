import { and, eq } from 'drizzle-orm';
import { Context } from 'hono';
import * as schema from '@chrono/postgres-schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { GetWorldRequest, GetWorldResponse } from '@chrono/service-types';

export async function getWorld(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { ownerID, worldID } = await ctx.req.json<GetWorldRequest>();

    const world = await db.query.worlds.findFirst({
      where: and(
        eq(schema.worlds.id, worldID),
        eq(schema.worlds.ownerID, ownerID),
      ),
    });

    const response: GetWorldResponse = {
      success: true,
      data: world ?? null,
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
