import { eq } from 'drizzle-orm';
import { Context } from 'hono';
import * as schema from '@chrononomicon/postgres-schema';
import { getAuth0IDFromContext } from '@chrononomicon/service-utils';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export async function getCurrentUser(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const auth0ID = getAuth0IDFromContext(ctx);

    const user = await db.query.users.findFirst({
      where: eq(schema.users.auth0ID, auth0ID),
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
