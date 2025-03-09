import { and, eq } from 'drizzle-orm';
import { Context } from 'hono';
import * as schema from '@chrono/postgres-schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  GenerateWorldNamesRequest,
  GenerateWorldNamesResponse,
} from '@chrono/service-types';

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
      return ctx.json({ success: false, error: 'World not found' }, 404);
    }

    // TODO(#23): implement world name generation
    const names = ['Example World'];

    const response: GenerateWorldNamesResponse = {
      success: true,
      data: names,
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
