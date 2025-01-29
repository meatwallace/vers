import { and, eq } from 'drizzle-orm';
import { Context } from 'hono';
import * as schema from '@chrono/postgres-schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DeleteWorldRequest, DeleteWorldResponse } from '@chrono/service-types';

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
      success: true,
      data: { deletedID: worldID },
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
