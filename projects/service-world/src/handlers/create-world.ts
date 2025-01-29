import { Context } from 'hono';
import * as schema from '@chrono/postgres-schema';
import { CreateWorldRequest, CreateWorldResponse } from '@chrono/service-types';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { createId } from '@paralleldrive/cuid2';

export async function createWorld(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { ownerID } = await ctx.req.json<CreateWorldRequest>();

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

    const response: CreateWorldResponse = {
      success: true,
      data: world,
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
