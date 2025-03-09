import * as schema from '@chrono/postgres-schema';
import {
  GenerateWorldNamesRequest,
  GenerateWorldNamesResponse,
} from '@chrono/service-types';
import { and, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';

export async function generateWorldNames(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { ownerID, worldID } =
      await ctx.req.json<GenerateWorldNamesRequest>();

    const world = await db.query.worlds.findFirst({
      where: and(
        eq(schema.worlds.id, worldID),
        eq(schema.worlds.ownerID, ownerID),
      ),
    });

    if (!world) {
      return ctx.json({ error: 'World not found', success: false }, 404);
    }

    // TODO(#23): implement world name generation
    const names = ['Example World'];

    const response: GenerateWorldNamesResponse = {
      data: names,
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
