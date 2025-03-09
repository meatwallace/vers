import * as schema from '@chrono/postgres-schema';
import { CreateWorldRequest, CreateWorldResponse } from '@chrono/service-types';
import { createId } from '@paralleldrive/cuid2';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';

export async function createWorld(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { ownerID } = await ctx.req.json<CreateWorldRequest>();

    const createdAt = new Date();

    // set a bunch of defaults
    const world: typeof schema.worlds.$inferSelect = {
      archetype: null,
      atmosphere: 'Neutral',
      createdAt,
      fantasyType: 'Medium',
      geographyFeatures: [
        'Deserts',
        'Forest',
        'Mountains',
        'Plains',
        'Swamps',
        'Tundra',
      ],
      geographyType: 'Supercontinent',
      id: createId(),
      name: 'New World',
      ownerID,
      population: 'Average',
      technologyLevel: 'Medieval',
      updatedAt: createdAt,
    };

    await db.insert(schema.worlds).values(world);

    const response: CreateWorldResponse = {
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
