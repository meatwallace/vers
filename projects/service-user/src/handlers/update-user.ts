import * as schema from '@vers/postgres-schema';
import { UpdateUserRequest, UpdateUserResponse } from '@vers/service-types';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';

export async function updateUser(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { id, ...update } = await ctx.req.json<UpdateUserRequest>();

    const [user] = await db
      .update(schema.users)
      .set({
        ...update,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, id))
      .returning({
        updatedID: schema.users.id,
      });

    const response: UpdateUserResponse = {
      data: { updatedID: user.updatedID },
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
