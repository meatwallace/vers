import { Context } from 'hono';
import * as schema from '@chrononomicon/postgres-schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { createId } from '@paralleldrive/cuid2';

type RequestBody = {
  ownerID: string;
};

export async function createWorld(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { ownerID } = await ctx.req.json<RequestBody>();
    const createdAt = new Date();

    // set a bunch of defaults
    const world: typeof schema.worlds.$inferSelect = {
      id: createId(),
      ownerID,
      name: 'New World',
      fantasyType: 'Medium',
      technologyLevel: 'Medieval',
      archetype: null,
      atmosphere: 'Neutral',
      population: 'Average',
      geographyType: 'Supercontinent',
      geographyFeatures: [
        'Deserts',
        'Forest',
        'Mountains',
        'Plains',
        'Swamps',
        'Tundra',
      ],
      updatedAt: createdAt,
      createdAt,
    };

    await db.insert(schema.worlds).values(world);

    return ctx.json({ success: true, data: world });
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      return ctx.json({ success: false, error: 'An unknown error occurred' });
    }

    throw error;
  }
}
