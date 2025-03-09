import * as schema from '@chrono/postgres-schema';
import { UpdateWorldRequest, UpdateWorldResponse } from '@chrono/service-types';
import { and, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';

export async function updateWorld(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { ownerID, worldID, ...update } =
      await ctx.req.json<UpdateWorldRequest>();

    const [world] = await db
      .update(schema.worlds)
      .set({
        ...update,
        updatedAt: new Date(),
      })
      .where(
        and(eq(schema.worlds.ownerID, ownerID), eq(schema.worlds.id, worldID)),
      )
      .returning();

    const response: UpdateWorldResponse = {
      data: world,
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
