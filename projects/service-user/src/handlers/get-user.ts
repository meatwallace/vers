import * as schema from '@chrono/postgres-schema';
import { GetUserRequest, GetUserResponse } from '@chrono/service-types';
import { eq, or } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';

export async function getUser(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { email, id } = await ctx.req.json<GetUserRequest>();

    if (!email && !id) {
      return ctx.json({
        error: 'Either email or id must be provided',
        success: false,
      });
    }

    const where = [
      email ? eq(schema.users.email, email) : undefined,
      id ? eq(schema.users.id, id) : undefined,
    ].filter(Boolean);

    const user = await db.query.users.findFirst({
      where: or(...where),
    });

    const response: GetUserResponse = {
      data: user ?? null,
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
