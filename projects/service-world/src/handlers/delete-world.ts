import * as schema from '@chrono/postgres-schema';
import { DeleteWorldRequest, DeleteWorldResponse } from '@chrono/service-types';
import { and, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';

export async function deleteWorld(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { ownerID, worldID } = await ctx.req.json<DeleteWorldRequest>();

    await db
      .delete(schema.worlds)
      .where(
        and(eq(schema.worlds.id, worldID), eq(schema.worlds.ownerID, ownerID)),
      );

    const response: DeleteWorldResponse = {
      data: { deletedID: worldID },
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
