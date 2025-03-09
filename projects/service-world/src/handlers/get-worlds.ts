import * as schema from '@chrono/postgres-schema';
import { GetWorldsRequest, GetWorldsResponse } from '@chrono/service-types';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';

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
      data: worlds,
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
