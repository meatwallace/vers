import { eq } from 'drizzle-orm';
import { Context } from 'hono';
import * as schema from '@campaign/postgres-schema';
import { getUserIDFromContext } from '@campaign/service-utils';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export async function getCurrentUser(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const userID = getUserIDFromContext(ctx);

    const user = await db.query.users.findFirst({
      where: eq(schema.users.auth0ID, userID),
    });

    return ctx.json({ success: true, data: user });
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      return ctx.json({ success: false, error: 'An unknown error occurred' });
    }

    throw error;
  }
}
