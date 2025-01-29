import { eq } from 'drizzle-orm';
import { Context } from 'hono';
import * as schema from '@chrono/postgres-schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { GetWorldsRequest, GetWorldsResponse } from '@chrono/service-types';

export async function getWorlds(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { ownerID } = await ctx.req.json<GetWorldsRequest>();

    const worlds = await db.query.worlds.findMany({
      where: eq(schema.worlds.ownerID, ownerID),
    });

    const response: GetWorldsResponse = {
      success: true,
      data: worlds,
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
