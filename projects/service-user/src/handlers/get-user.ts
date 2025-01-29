import { Context } from 'hono';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq, or } from 'drizzle-orm';
import * as schema from '@chrono/postgres-schema';
import { GetUserRequest, GetUserResponse } from '@chrono/service-types';

export async function getUser(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { email, id } = await ctx.req.json<GetUserRequest>();

    if (!email && !id) {
      return ctx.json({
        success: false,
        error: 'Either email or id must be provided',
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
      success: true,
      data: user ?? null,
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
