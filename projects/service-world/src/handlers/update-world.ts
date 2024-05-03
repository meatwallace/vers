import { and, eq } from 'drizzle-orm';
import { Context } from 'hono';
import * as schema from '@chrononomicon/postgres-schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

type World = typeof schema.worlds.$inferSelect;

type RequestBody = {
  ownerID: string;
  worldID: string;
  name?: string;
  fantasyType?: World['fantasyType'];
  technologyLevel?: World['technologyLevel'];
  archetype?: World['archetype'];
  atmosphere?: World['atmosphere'];
  population?: World['population'];
  geographyType?: World['geographyType'];
  geographyFeatures?: World['geographyFeatures'];
};

export async function updateWorld(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { ownerID, worldID, ...update } = await ctx.req.json<RequestBody>();

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

    return ctx.json({ success: true, data: world });
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      return ctx.json({ success: false, error: 'An unknown error occurred' });
    }

    throw error;
  }
}
