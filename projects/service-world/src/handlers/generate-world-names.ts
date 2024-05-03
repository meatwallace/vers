import { and, eq } from 'drizzle-orm';
import { Context } from 'hono';
import * as schema from '@chrononomicon/postgres-schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

type RequestBody = {
  ownerID: string;
  worldID: string;
};

export async function generateWorldNames(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { ownerID, worldID } = await ctx.req.json<RequestBody>();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const world = await db.query.worlds.findFirst({
      where: and(
        eq(schema.worlds.id, worldID),
        eq(schema.worlds.ownerID, ownerID),
      ),
    });

    // TODO(#23): implement world name generation
    const names = ['Example World'];

    return ctx.json({ success: true, data: names });
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      return ctx.json({ success: false, error: 'An unknown error occurred' });
    }

    throw error;
  }
}
