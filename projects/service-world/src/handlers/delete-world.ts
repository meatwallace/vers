import { and, eq } from 'drizzle-orm';
import { Context } from 'hono';
import * as schema from '@chrononomicon/postgres-schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

type RequestBody = {
  ownerID: string;
  worldID: string;
};

export async function deleteWorld(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { ownerID, worldID } = await ctx.req.json<RequestBody>();

    await db
      .delete(schema.worlds)
      .where(
        and(eq(schema.worlds.id, worldID), eq(schema.worlds.ownerID, ownerID)),
      );

    return ctx.json({ success: true, data: { deletedID: worldID } });
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      return ctx.json({ success: false, error: 'An unknown error occurred' });
    }

    throw error;
  }
}
