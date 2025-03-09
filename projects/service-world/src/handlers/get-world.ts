import * as schema from '@chrono/postgres-schema';
import { GetWorldRequest, GetWorldResponse } from '@chrono/service-types';
import { and, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';

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
      data: world ?? null,
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
