import { eq } from 'drizzle-orm';
import { Context } from 'hono';
import * as schema from '@chrononomicon/postgres-schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

type RequestBody = {
  ownerID: string;
};

export async function getWorlds(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { ownerID } = await ctx.req.json<RequestBody>();

    const worlds = await db.query.worlds.findMany({
      where: eq(schema.worlds.ownerID, ownerID),
    });

    return ctx.json({ success: true, data: worlds });
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      return ctx.json({ success: false, error: 'An unknown error occurred' });
    }

    throw error;
  }
}
